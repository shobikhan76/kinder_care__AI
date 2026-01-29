class student: 
    def __init__(self , *name ):
        self.name = "Rolin"
        self.age = 21
    


student1 = student()
print(student1.name)
print(student1.age)
student1.name = "DevRolin"
print(student1.name)
