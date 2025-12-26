import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    u = User.objects.get(username='Bhumika001')
    print(f"User found: {u.username}")
    print(f"Role: {u.role}")
    print(f"Is Active: {u.is_active}")
except User.DoesNotExist:
    print("User 'Bhumika001' not found.")
