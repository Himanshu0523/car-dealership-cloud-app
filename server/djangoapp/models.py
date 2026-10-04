from django.db import models


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    CAR_TYPES = [
        ("SEDAN", "Sedan"),
        ("SUV", "SUV"),
        ("WAGON", "Wagon"),
        ("HATCHBACK", "Hatchback"),
        ("COUPE", "Coupe"),
        ("MINIVAN", "Minivan"),
        ("TRUCK", "Truck"),
        ("EV", "Electric"),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=100)
    dealer_id = models.IntegerField(default=0)
    type = models.CharField(max_length=20, choices=CAR_TYPES, default="SEDAN")
    year = models.IntegerField(default=2024)

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
