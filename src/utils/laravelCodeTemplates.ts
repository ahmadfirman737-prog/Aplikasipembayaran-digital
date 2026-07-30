import { LaravelFile } from '../types';

export const laravelCodeFiles: LaravelFile[] = [
  {
    id: 'l-01',
    filename: 'ProductController.php',
    path: 'app/Http/Controllers/ProductController.php',
    category: 'Controller',
    description: 'Controller untuk manajemen stok barang, koreksi stok, dan notifikasi email stok kritis.',
    content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Product;
use App\\Mail\\CriticalStockAlertMail;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Mail;

class ProductController extends Controller
{
    /**
     * Tampilkan daftar produk & status stok
     */
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('stock', 'asc')->paginate(15);

        return view('products.index', compact('products'));
    }

    /**
     * Simpan produk baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|unique:products,sku',
            'barcode' => 'nullable|string',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'unit' => 'required|string',
            'supplier' => 'required|string',
        ]);

        $product = Product::create($validated);

        // Cek jika stok awal langsung berada di bawah batas minimum
        $this->checkLowStockAlert($product);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Update/Koreksi Jumlah Stok Barang
     */
    public function adjustStock(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer',
            'type' => 'required|in:in,out,adjust',
            'reason' => 'required|string|max:255',
        ]);

        $product = Product::findOrFail($id);

        if ($request->type === 'in') {
            $product->stock += $request->quantity;
        } elseif ($request->type === 'out') {
            $product->stock = max(0, $product->stock - $request->quantity);
        } else {
            $product->stock = $request->quantity;
        }

        $product->save();

        // Notifikasi Email Otomatis jika stok mencapai batas minim
        $this->checkLowStockAlert($product);

        return response()->json([
            'success' => true,
            'message' => 'Stok berhasil diperbarui',
            'current_stock' => $product->stock,
            'is_low_stock' => $product->stock <= $product->min_stock
        ]);
    }

    /**
     * Kirim email otomatis jika stok kritis
     */
    private function checkLowStockAlert(Product $product)
    {
        if ($product->stock <= $product->min_stock) {
            $adminEmails = ['admin@solusiniaga.co.id', 'gudang@solusiniaga.co.id'];
            
            foreach ($adminEmails as $email) {
                Mail::to($email)->send(new CriticalStockAlertMail($product));
            }
        }
    }
}
`,
  },
  {
    id: 'l-02',
    filename: 'TransactionController.php',
    path: 'app/Http/Controllers/TransactionController.php',
    category: 'Controller',
    description: 'Proses checkout POS, pembuatan nomor invoice & surat jalan, dan pengurangan stok otomatis.',
    content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Transaction;
use App\\Models\\TransactionItem;
use App\\Models\\Product;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class TransactionController extends Controller
{
    /**
     * Proses Checkout & Penerbitan Faktur + Surat Jalan
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'address' => 'required|string',
            'payment_method' => 'required|in:Cash,Transfer,QRIS,Credit Card',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $todayStr = date('Ymd');
            $trxCountToday = Transaction::whereDate('created_at', today())->count() + 1;
            
            $invoiceNo = 'INV/' . $todayStr . '/' . str_pad($trxCountToday, 3, '0', STR_PAD_LEFT);
            $suratJalanNo = 'SJ/' . $todayStr . '/' . str_pad($trxCountToday, 3, '0', STR_PAD_LEFT);

            $subtotal = 0;
            $itemsData = [];

            foreach ($request->items as $itemInput) {
                $product = Product::lockForUpdate()->findOrFail($itemInput['product_id']);

                if ($product->stock < $itemInput['quantity']) {
                    throw new \\Exception("Stok tidak mencukupi untuk produk: {$product->name}");
                }

                $itemSubtotal = $product->price * $itemInput['quantity'];
                $subtotal += $itemSubtotal;

                // Kurangi stok barang
                $product->stock -= $itemInput['quantity'];
                $product->save();

                $itemsData[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $itemInput['quantity'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            $discount = $request->discount ?? 0;
            $tax = ($subtotal - $discount) * 0.11; // PPN 11%
            $grandTotal = ($subtotal - $discount) + $tax;

            $transaction = Transaction::create([
                'invoice_number' => $invoiceNo,
                'surat_jalan_number' => $suratJalanNo,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'address' => $request->address,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'grand_total' => $grandTotal,
                'payment_method' => $request->payment_method,
                'payment_status' => 'Lunas',
                'shipping_status' => 'Siap Kirim',
                'driver_name' => $request->driver_name ?? 'Slamet Supriyadi',
                'vehicle_plate' => $request->vehicle_plate ?? 'B 9284 SJA',
                'cashier_id' => auth()->id(),
            ]);

            foreach ($itemsData as $item) {
                $transaction->items()->create($item);
            }

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibuat',
                'invoice_number' => $invoiceNo,
                'surat_jalan_number' => $suratJalanNo,
                'grand_total' => $grandTotal,
            ]);
        });
    }
}
`,
  },
  {
    id: 'l-03',
    filename: 'Product.php',
    path: 'app/Models/Product.php',
    category: 'Model',
    description: 'Model Eloquent Produk dengan scope status stok kritis dan relasi.',
    content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'barcode',
        'name',
        'category',
        'price',
        'cost_price',
        'stock',
        'min_stock',
        'unit',
        'supplier',
        'ecommerce_synced'
    ];

    /**
     * Scope query untuk mengambil barang yang stoknya kritis
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock', '<=', 'min_stock');
    }

    /**
     * Accessor atribut status stok
     */
    public function getStockStatusAttribute()
    {
        if ($this->stock <= 0) {
            return 'Habis';
        } elseif ($this->stock <= $this->min_stock) {
            return 'Kritis';
        }
        return 'Aman';
    }
}
`,
  },
  {
    id: 'l-04',
    filename: 'CriticalStockAlertMail.php',
    path: 'app/Mail/CriticalStockAlertMail.php',
    category: 'Mail',
    description: 'Mail Mailable Class untuk notifikasi email otomatis saat stok barang mencapai level kritis.',
    content: `<?php

namespace App\\Mail;

use App\\Models\\Product;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Mail\\Mailable;
use Illuminate\\Queue\\SerializesModels;

class CriticalStockAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function build()
    {
        return $this->subject("[PERINGATAN STOK KRITIS] {$this->product->name} (Sisa {$this->product->stock} {$this->product->unit})")
                    ->markdown('emails.stock_alert')
                    ->with([
                        'sku' => $this->product->sku,
                        'name' => $this->product->name,
                        'stock' => $this->product->stock,
                        'minStock' => $this->product->min_stock,
                        'supplier' => $this->product->supplier,
                    ]);
    }
}
`,
  },
  {
    id: 'l-05',
    filename: '2026_01_01_create_products_table.php',
    path: 'database/migrations/2026_01_01_create_products_table.php',
    category: 'Migration',
    description: 'Skema migrasi database tabel produk, kategori, dan batas stok minim.',
    content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->string('category');
            $table->decimal('price', 15, 2);
            $table->decimal('cost_price', 15, 2);
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(5);
            $table->string('unit')->default('Pcs');
            $table->string('supplier')->nullable();
            $table->boolean('ecommerce_synced')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};
`,
  },
  {
    id: 'l-06',
    filename: 'api.php',
    path: 'routes/api.php',
    category: 'Route',
    description: 'Rute API RESTful untuk integrasi dan sinkronisasi stok e-commerce secara real-time.',
    content: `<?php

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\EcommerceSyncController;

/*
|--------------------------------------------------------------------------
| E-Commerce Stock Sync API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Synchronize stock for all connected marketplaces
    Route::post('/ecommerce/sync-stock', [EcommerceSyncController::class, 'syncStock']);
    
    // Webhook receiver for stock updates from Shopee / Tokopedia
    Route::post('/ecommerce/webhook/stock-update', [EcommerceSyncController::class, 'handleWebhook']);
});
`,
  },
];
