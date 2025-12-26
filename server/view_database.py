import sqlite3
import os

# Path to the SQLite database
db_path = r'c:\Users\conne\Downloads\MVTPS-leelakrishnasai\MVTPS-leelakrishnasai\server\db.sqlite3'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 80)
print("MVTPS DATABASE CONTENTS")
print("=" * 80)

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = cursor.fetchall()

print(f"\n📊 Total Tables: {len(tables)}\n")

# Core tables to display
core_tables = [
    'core_user',
    'core_vessel',
    'core_port',
    'core_voyage',
    'core_event',
    'core_notification',
    'core_vessel_position',
    'core_vessel_subscription',
    'core_vessel_alert'
]

for table_name in core_tables:
    print("\n" + "=" * 80)
    print(f"TABLE: {table_name}")
    print("=" * 80)
    
    try:
        # Get table info
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        
        # Get row count
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        count = cursor.fetchone()[0]
        
        print(f"📈 Total Records: {count}")
        print(f"📋 Columns: {', '.join(column_names)}\n")
        
        if count > 0:
            # Get sample data (first 5 rows)
            cursor.execute(f"SELECT * FROM {table_name} LIMIT 5;")
            rows = cursor.fetchall()
            
            print(f"Sample Data (showing up to 5 records):")
            print("-" * 80)
            
            for i, row in enumerate(rows, 1):
                print(f"\nRecord {i}:")
                for col_name, value in zip(column_names, row):
                    # Truncate long values
                    if isinstance(value, str) and len(value) > 100:
                        value = value[:100] + "..."
                    print(f"  {col_name}: {value}")
        else:
            print("⚠️  No data in this table")
            
    except sqlite3.Error as e:
        print(f"❌ Error querying {table_name}: {e}")

# Summary statistics
print("\n" + "=" * 80)
print("SUMMARY STATISTICS")
print("=" * 80)

summary_queries = {
    'Total Users': "SELECT COUNT(*) FROM core_user",
    'Total Vessels': "SELECT COUNT(*) FROM core_vessel",
    'Total Ports': "SELECT COUNT(*) FROM core_port",
    'Total Voyages': "SELECT COUNT(*) FROM core_voyage",
    'Active Voyages': "SELECT COUNT(*) FROM core_voyage WHERE status='in_progress'",
    'Total Events': "SELECT COUNT(*) FROM core_event",
    'Total Notifications': "SELECT COUNT(*) FROM core_notification",
    'Unread Notifications': "SELECT COUNT(*) FROM core_notification WHERE is_read=0",
    'Total Vessel Positions': "SELECT COUNT(*) FROM core_vessel_position",
    'Active Subscriptions': "SELECT COUNT(*) FROM core_vessel_subscription WHERE is_active=1",
    'Total Vessel Alerts': "SELECT COUNT(*) FROM core_vessel_alert"
}

for label, query in summary_queries.items():
    try:
        cursor.execute(query)
        result = cursor.fetchone()[0]
        print(f"  {label}: {result}")
    except sqlite3.Error as e:
        print(f"  {label}: Error - {e}")

# User breakdown by role
print("\n" + "-" * 80)
print("User Breakdown by Role:")
print("-" * 80)
try:
    cursor.execute("SELECT role, COUNT(*) FROM core_user GROUP BY role")
    for role, count in cursor.fetchall():
        print(f"  {role}: {count}")
except sqlite3.Error as e:
    print(f"  Error: {e}")

# Vessel types
print("\n" + "-" * 80)
print("Vessel Types:")
print("-" * 80)
try:
    cursor.execute("SELECT type, COUNT(*) FROM core_vessel GROUP BY type")
    for vtype, count in cursor.fetchall():
        print(f"  {vtype}: {count}")
except sqlite3.Error as e:
    print(f"  Error: {e}")

# Voyage status
print("\n" + "-" * 80)
print("Voyage Status:")
print("-" * 80)
try:
    cursor.execute("SELECT status, COUNT(*) FROM core_voyage GROUP BY status")
    for status, count in cursor.fetchall():
        print(f"  {status}: {count}")
except sqlite3.Error as e:
    print(f"  Error: {e}")

# Event types
print("\n" + "-" * 80)
print("Event Types:")
print("-" * 80)
try:
    cursor.execute("SELECT event_type, COUNT(*) FROM core_event GROUP BY event_type")
    for etype, count in cursor.fetchall():
        print(f"  {etype}: {count}")
except sqlite3.Error as e:
    print(f"  Error: {e}")

print("\n" + "=" * 80)
print("✅ Database query completed successfully!")
print("=" * 80)

# Close connection
conn.close()
