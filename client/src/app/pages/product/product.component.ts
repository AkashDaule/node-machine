import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  categories: any[] = [];

  productName = '';
  categoryId: number | null = null;
  editingId: number | null = null;

  page = 0; // Page starts from 0
  limit = 10;
  total = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // 🔹 Computed value for template
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  // Display page number (1-based for user display)
  get displayPage(): number {
    return this.page ;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  loadProducts() {
    this.productService.getProducts(this.page, this.limit).subscribe(res => {
      this.products = res.data;   // backend returns { data, total }
      this.total = res.total;
    });
  }

  saveProduct() {
    if (!this.productName || !this.categoryId) return;

   const payload = {
   name: this.productName,       // ✅ correct
   category_id: this.categoryId
};


    if (this.editingId) {
      this.productService.updateProduct(this.editingId, payload)
        .subscribe(() => {
          this.showSuccess('Product updated successfully');
          this.reset();
        });
    } else {
      this.productService.addProduct(payload)
        .subscribe(() => {
          this.showSuccess('Product added successfully');
          this.reset();
        });
    }
  }

  editProduct(p: any) {
    this.productName = p.product_name;
    this.categoryId = p.category_id != null ? Number(p.category_id) : null;
    this.editingId = p.product_id;
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Product has been deleted.',
            'success'
          );
          this.loadProducts();
        });
      }
    });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadProducts();
    }
  }

  reset() {
    this.productName = '';
    this.categoryId = null;
    this.editingId = null;
    this.loadProducts();
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
