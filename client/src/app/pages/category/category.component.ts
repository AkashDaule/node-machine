import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  categoryName: string = '';
  editingId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  saveCategory() {
    if (!this.categoryName.trim()) return;

    if (this.editingId) {
      this.categoryService
        .updateCategory(this.editingId, { name: this.categoryName })
        .subscribe(() => {
          this.showSuccess('Category updated successfully');
          this.reset();
        });
    } else {
      this.categoryService
        .addCategory({ name: this.categoryName })
        .subscribe(() => {
          this.showSuccess('Category added successfully');
          this.reset();
        });
    }
  }

  editCategory(cat: any) {
    this.categoryName = cat.name;
    this.editingId = cat.id;
  }

  deleteCategory(id: number) {
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
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Category has been deleted.',
              'success'
            );
            this.loadCategories();
          },
          error: (err) => {
            Swal.fire(
              'Error!',
              err.error.message || 'Failed to delete category.',
              'error'
            );
          }
        });
      }
    });
  }

  reset() {
    this.categoryName = '';
    this.editingId = null;
    this.loadCategories();
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }
}
