import csv
import random
import psycopg2
import json


conn = psycopg2.connect(
    database = "cos730_db", 
    user = "postgres", 
    host= 'localhost',
    password = "admin",
    port = 5432
)

with open('sentiment.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file) #by default, it's expecting values seperated by a comma
    lines = list(csv_reader) # Convert the reader object to a list

num_lines = len(lines)
blackList = []

for i in range(155):
    rand_index = random.randint(0, num_lines - 1)

    if rand_index in blackList: #generate anoher random number
        while(True):
            rand_index = random.randint(0, num_lines - 1) 

            if rand_index not in blackList:
                blackList.append(rand_index)
                break
    else: #random index is not in the list - unique value
        blackList.append(rand_index)  
    
    random_line = lines[rand_index]

    ticker, name, sentiment = random_line

    cur = conn.cursor()

    cur.execute("INSERT INTO sentiment VALUES(%s,%s,%s)", (ticker,name,sentiment))

    conn.commit()

print("INSERTING SENTIMENT DATA - SUCCESS")
