from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import (
    User, Vessel, Port, Voyage, Event, Notification, 
    VesselPosition, VesselSubscription, VesselAlert
)


class Command(BaseCommand):
    help = 'Populate database with dummy data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting to populate database with dummy data...'))

        # Clear existing data (optional - comment out if you want to keep existing data)
        self.stdout.write('Clearing existing data...')
        VesselAlert.objects.all().delete()
        VesselSubscription.objects.all().delete()
        VesselPosition.objects.all().delete()
        Notification.objects.all().delete()
        Event.objects.all().delete()
        Voyage.objects.all().delete()
        Port.objects.all().delete()
        Vessel.objects.all().delete()
        User.objects.all().delete()

        # Create Users
        self.stdout.write('Creating users...')
        users = []
        
        # Admin user
        admin = User.objects.create_user(
            username='admin',
            email='admin@mvtps.com',
            password='admin123',
            role=User.ROLE_ADMIN
        )
        users.append(admin)
        
        # Operators
        operator1 = User.objects.create_user(
            username='operator1',
            email='operator1@mvtps.com',
            password='operator123',
            role=User.ROLE_OPERATOR
        )
        users.append(operator1)
        
        operator2 = User.objects.create_user(
            username='operator2',
            email='operator2@mvtps.com',
            password='operator123',
            role=User.ROLE_OPERATOR
        )
        users.append(operator2)
        
        # Analysts
        analyst1 = User.objects.create_user(
            username='analyst1',
            email='analyst1@mvtps.com',
            password='analyst123',
            role=User.ROLE_ANALYST
        )
        users.append(analyst1)
        
        analyst2 = User.objects.create_user(
            username='analyst2',
            email='analyst2@mvtps.com',
            password='analyst123',
            role=User.ROLE_ANALYST
        )
        users.append(analyst2)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        # Create Ports
        self.stdout.write('Creating ports...')
        ports_data = [
            {
                'name': 'Port of Singapore',
                'location': '1.2644° N, 103.8220° E',
                'country': 'Singapore',
                'congestion_score': 3.5,
                'avg_wait_time': 12.5,
                'arrivals': 450,
                'departures': 445
            },
            {
                'name': 'Port of Shanghai',
                'location': '31.2304° N, 121.4737° E',
                'country': 'China',
                'congestion_score': 4.2,
                'avg_wait_time': 18.3,
                'arrivals': 520,
                'departures': 510
            },
            {
                'name': 'Port of Rotterdam',
                'location': '51.9225° N, 4.4792° E',
                'country': 'Netherlands',
                'congestion_score': 2.8,
                'avg_wait_time': 8.7,
                'arrivals': 380,
                'departures': 375
            },
            {
                'name': 'Port of Dubai',
                'location': '25.2048° N, 55.2708° E',
                'country': 'UAE',
                'congestion_score': 3.1,
                'avg_wait_time': 10.2,
                'arrivals': 410,
                'departures': 405
            },
            {
                'name': 'Port of Los Angeles',
                'location': '33.7405° N, 118.2720° W',
                'country': 'USA',
                'congestion_score': 3.9,
                'avg_wait_time': 15.6,
                'arrivals': 390,
                'departures': 385
            },
            {
                'name': 'Port of Mumbai',
                'location': '18.9388° N, 72.8354° E',
                'country': 'India',
                'congestion_score': 4.5,
                'avg_wait_time': 22.1,
                'arrivals': 320,
                'departures': 315
            }
        ]
        
        ports = []
        for port_data in ports_data:
            port = Port.objects.create(**port_data)
            ports.append(port)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(ports)} ports'))

        # Create Vessels
        self.stdout.write('Creating vessels...')
        vessels_data = [
            {
                'imo_number': 'IMO9876543',
                'name': 'Pacific Explorer',
                'type': 'Container Ship',
                'flag': 'Panama',
                'cargo_type': 'Containers',
                'operator': 'Maersk Line',
                'destination': 'Port of Singapore',
                'last_position_lat': 1.2644,
                'last_position_lon': 103.8220
            },
            {
                'imo_number': 'IMO9876544',
                'name': 'Atlantic Voyager',
                'type': 'Bulk Carrier',
                'flag': 'Liberia',
                'cargo_type': 'Iron Ore',
                'operator': 'MSC Mediterranean',
                'destination': 'Port of Rotterdam',
                'last_position_lat': 51.9225,
                'last_position_lon': 4.4792
            },
            {
                'imo_number': 'IMO9876545',
                'name': 'Indian Ocean Star',
                'type': 'Tanker',
                'flag': 'Marshall Islands',
                'cargo_type': 'Crude Oil',
                'operator': 'Frontline Ltd',
                'destination': 'Port of Dubai',
                'last_position_lat': 25.2048,
                'last_position_lon': 55.2708
            },
            {
                'imo_number': 'IMO9876546',
                'name': 'Mediterranean Queen',
                'type': 'Container Ship',
                'flag': 'Greece',
                'cargo_type': 'Containers',
                'operator': 'CMA CGM',
                'destination': 'Port of Shanghai',
                'last_position_lat': 31.2304,
                'last_position_lon': 121.4737
            },
            {
                'imo_number': 'IMO9876547',
                'name': 'Arctic Navigator',
                'type': 'Reefer Ship',
                'flag': 'Norway',
                'cargo_type': 'Frozen Goods',
                'operator': 'Hapag-Lloyd',
                'destination': 'Port of Los Angeles',
                'last_position_lat': 33.7405,
                'last_position_lon': -118.2720
            },
            {
                'imo_number': 'IMO9876548',
                'name': 'Mumbai Express',
                'type': 'Container Ship',
                'flag': 'India',
                'cargo_type': 'Containers',
                'operator': 'Shipping Corporation of India',
                'destination': 'Port of Mumbai',
                'last_position_lat': 18.9388,
                'last_position_lon': 72.8354
            },
            {
                'imo_number': 'IMO9876549',
                'name': 'Singapore Trader',
                'type': 'General Cargo',
                'flag': 'Singapore',
                'cargo_type': 'Mixed Cargo',
                'operator': 'PIL Pacific International',
                'destination': 'Port of Singapore',
                'last_position_lat': 1.2644,
                'last_position_lon': 103.8220
            },
            {
                'imo_number': 'IMO9876550',
                'name': 'Shanghai Dragon',
                'type': 'Container Ship',
                'flag': 'China',
                'cargo_type': 'Containers',
                'operator': 'COSCO Shipping',
                'destination': 'Port of Shanghai',
                'last_position_lat': 31.2304,
                'last_position_lon': 121.4737
            }
        ]
        
        vessels = []
        for vessel_data in vessels_data:
            vessel = Vessel.objects.create(**vessel_data)
            vessels.append(vessel)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(vessels)} vessels'))

        # Create Voyages
        self.stdout.write('Creating voyages...')
        voyages = []
        now = timezone.now()
        
        # Voyage 1: Pacific Explorer from Shanghai to Singapore
        voyage1 = Voyage.objects.create(
            vessel=vessels[0],
            port_from=ports[1],  # Shanghai
            port_to=ports[0],    # Singapore
            departure_time=now - timedelta(days=5),
            arrival_time=now + timedelta(days=2),
            status='in_progress'
        )
        voyages.append(voyage1)
        
        # Voyage 2: Atlantic Voyager from Rotterdam to Los Angeles
        voyage2 = Voyage.objects.create(
            vessel=vessels[1],
            port_from=ports[2],  # Rotterdam
            port_to=ports[4],    # Los Angeles
            departure_time=now - timedelta(days=10),
            arrival_time=now + timedelta(days=5),
            status='in_progress'
        )
        voyages.append(voyage2)
        
        # Voyage 3: Indian Ocean Star from Dubai to Mumbai
        voyage3 = Voyage.objects.create(
            vessel=vessels[2],
            port_from=ports[3],  # Dubai
            port_to=ports[5],    # Mumbai
            departure_time=now - timedelta(days=3),
            arrival_time=now + timedelta(days=1),
            status='in_progress'
        )
        voyages.append(voyage3)
        
        # Voyage 4: Mediterranean Queen - Completed
        voyage4 = Voyage.objects.create(
            vessel=vessels[3],
            port_from=ports[2],  # Rotterdam
            port_to=ports[1],    # Shanghai
            departure_time=now - timedelta(days=20),
            arrival_time=now - timedelta(days=5),
            status='completed'
        )
        voyages.append(voyage4)
        
        # Voyage 5: Arctic Navigator - Scheduled
        voyage5 = Voyage.objects.create(
            vessel=vessels[4],
            port_from=ports[0],  # Singapore
            port_to=ports[4],    # Los Angeles
            departure_time=now + timedelta(days=3),
            arrival_time=now + timedelta(days=15),
            status='scheduled'
        )
        voyages.append(voyage5)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(voyages)} voyages'))

        # Create Events
        self.stdout.write('Creating events...')
        events = []
        
        # Departure events
        event1 = Event.objects.create(
            vessel=vessels[0],
            event_type='departure',
            location='Port of Shanghai',
            timestamp=now - timedelta(days=5),
            details='Departed from Port of Shanghai with 5000 containers'
        )
        events.append(event1)
        
        event2 = Event.objects.create(
            vessel=vessels[1],
            event_type='departure',
            location='Port of Rotterdam',
            timestamp=now - timedelta(days=10),
            details='Departed with iron ore cargo'
        )
        events.append(event2)
        
        # Arrival event
        event3 = Event.objects.create(
            vessel=vessels[3],
            event_type='arrival',
            location='Port of Shanghai',
            timestamp=now - timedelta(days=5),
            details='Arrived at Port of Shanghai'
        )
        events.append(event3)
        
        # Maintenance event
        event4 = Event.objects.create(
            vessel=vessels[4],
            event_type='maintenance',
            location='Port of Singapore',
            timestamp=now - timedelta(days=2),
            details='Scheduled maintenance - engine inspection'
        )
        events.append(event4)
        
        # Inspection event
        event5 = Event.objects.create(
            vessel=vessels[2],
            event_type='inspection',
            location='Port of Dubai',
            timestamp=now - timedelta(days=3),
            details='Safety inspection completed successfully'
        )
        events.append(event5)
        
        # Incident event
        event6 = Event.objects.create(
            vessel=vessels[1],
            event_type='incident',
            location='Atlantic Ocean',
            timestamp=now - timedelta(days=7),
            details='Minor delay due to weather conditions'
        )
        events.append(event6)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(events)} events'))

        # Create Vessel Positions
        self.stdout.write('Creating vessel positions...')
        positions = []
        
        # Create position history for Pacific Explorer
        for i in range(10):
            position = VesselPosition.objects.create(
                vessel=vessels[0],
                latitude=1.2644 + (i * 0.5),
                longitude=103.8220 + (i * 0.3),
                speed=15.5 + (i * 0.2),
                course=180.0,
                timestamp=now - timedelta(hours=i*6),
                source='marinetraffic'
            )
            positions.append(position)
        
        # Create position history for Atlantic Voyager
        for i in range(8):
            position = VesselPosition.objects.create(
                vessel=vessels[1],
                latitude=51.9225 - (i * 0.8),
                longitude=4.4792 - (i * 1.2),
                speed=12.3 + (i * 0.1),
                course=270.0,
                timestamp=now - timedelta(hours=i*8),
                source='aishub'
            )
            positions.append(position)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(positions)} vessel positions'))

        # Create Notifications
        self.stdout.write('Creating notifications...')
        notifications = []
        
        notif1 = Notification.objects.create(
            user=operator1,
            vessel=vessels[0],
            event=events[0],
            message='Pacific Explorer has departed from Port of Shanghai',
            type='info',
            event_type='departure',
            is_read=False
        )
        notifications.append(notif1)
        
        notif2 = Notification.objects.create(
            user=analyst1,
            vessel=vessels[1],
            event=events[5],
            message='Atlantic Voyager experienced minor delay due to weather',
            type='warning',
            event_type='position_update',
            is_read=False
        )
        notifications.append(notif2)
        
        notif3 = Notification.objects.create(
            user=operator2,
            vessel=vessels[3],
            event=events[2],
            message='Mediterranean Queen has arrived at Port of Shanghai',
            type='info',
            event_type='arrival',
            is_read=True
        )
        notifications.append(notif3)
        
        notif4 = Notification.objects.create(
            user=admin,
            vessel=vessels[4],
            event=events[3],
            message='Arctic Navigator scheduled for maintenance',
            type='alert',
            event_type='unknown',
            is_read=False
        )
        notifications.append(notif4)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(notifications)} notifications'))

        # Create Vessel Subscriptions
        self.stdout.write('Creating vessel subscriptions...')
        subscriptions = []
        
        sub1 = VesselSubscription.objects.create(
            user=operator1,
            vessel=vessels[0],
            is_active=True,
            alert_type='all'
        )
        subscriptions.append(sub1)
        
        sub2 = VesselSubscription.objects.create(
            user=operator1,
            vessel=vessels[1],
            is_active=True,
            alert_type='position_update'
        )
        subscriptions.append(sub2)
        
        sub3 = VesselSubscription.objects.create(
            user=analyst1,
            vessel=vessels[2],
            is_active=True,
            alert_type='arrival'
        )
        subscriptions.append(sub3)
        
        sub4 = VesselSubscription.objects.create(
            user=analyst2,
            vessel=vessels[3],
            is_active=False,
            alert_type='departure'
        )
        subscriptions.append(sub4)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(subscriptions)} vessel subscriptions'))

        # Create Vessel Alerts
        self.stdout.write('Creating vessel alerts...')
        alerts = []
        
        alert1 = VesselAlert.objects.create(
            subscription=sub1,
            alert_type='departure',
            message='Pacific Explorer has departed from Port of Shanghai',
            status='sent'
        )
        alerts.append(alert1)
        
        alert2 = VesselAlert.objects.create(
            subscription=sub2,
            alert_type='position_update',
            message='Atlantic Voyager position updated',
            status='read',
            read_at=now - timedelta(hours=2)
        )
        alerts.append(alert2)
        
        alert3 = VesselAlert.objects.create(
            subscription=sub3,
            alert_type='arrival',
            message='Indian Ocean Star approaching Port of Mumbai',
            status='pending'
        )
        alerts.append(alert3)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(alerts)} vessel alerts'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Users: {len(users)}'))
        self.stdout.write(self.style.SUCCESS(f'Ports: {len(ports)}'))
        self.stdout.write(self.style.SUCCESS(f'Vessels: {len(vessels)}'))
        self.stdout.write(self.style.SUCCESS(f'Voyages: {len(voyages)}'))
        self.stdout.write(self.style.SUCCESS(f'Events: {len(events)}'))
        self.stdout.write(self.style.SUCCESS(f'Vessel Positions: {len(positions)}'))
        self.stdout.write(self.style.SUCCESS(f'Notifications: {len(notifications)}'))
        self.stdout.write(self.style.SUCCESS(f'Vessel Subscriptions: {len(subscriptions)}'))
        self.stdout.write(self.style.SUCCESS(f'Vessel Alerts: {len(alerts)}'))
        self.stdout.write(self.style.SUCCESS('\nDummy data has been successfully added to the database!'))
