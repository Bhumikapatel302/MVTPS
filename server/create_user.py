import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'Bhumika001'
password = 'password123'
role = 'operator'

if not User.objects.filter(username=username).exists():
    User.objects.create_user(username=username, email='bhumika@example.com', password=password, role=role)
    print(f"Created user '{username}' with role '{role}' and password '{password}'")
else:
    print(f"User '{username}' already exists")
