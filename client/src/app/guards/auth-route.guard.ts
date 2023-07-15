import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { inject } from '@angular/core';

export const authRouteGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const currentUser = auth.getCurrentUser();
  if (currentUser == "") {
    toast.makeToast({
      state: "close",
      message: "Please log in",
      barClass: ['bg-red-600']
    });
    return false
  }
  return true;
};
