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

with open('esg.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file) #by default, it's expecting values seperated by a comma
    lines = list(csv_reader) # Convert the reader object to a list

num_lines = len(lines)
blackList = []
ratings_agencies = ['msci', 's&p','dow jones']

for i in range(100):
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

    ticker, name, rating = random_line

    #Generate Auxillary Values
    random_rating_number = random.randint(0,2) #rand_int includes the last value
    
    agency = ratings_agencies[random_rating_number]
    
    cur = conn.cursor()

    cur.execute("INSERT INTO esg VALUES(%s,%s,%s,%s)", (ticker,name,rating,agency))

    conn.commit()


print("INSERTING ESG DATA - SUCCESS")

    