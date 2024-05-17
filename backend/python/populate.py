import csv
import random
import psycopg2

conn = psycopg2.connect(
    database = "cos730_db", 
    user = "postgres", 
    host= 'localhost',
    password = "admin",
    port = 5432
)

blackList = []

with open('ETFG_INDP.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file) #by default, it's expecting values seperated by a comma
    lines = list(csv_reader) # Convert the reader object to a list

# check the number of lines read
num_lines = len(lines)

for i in range(100):
    rand_index = random.randint(0, num_lines - 1)
    random_line = lines[rand_index]

    if rand_index in blackList: #generate anoher random number
        while(True):
            rand_index = random.randint(0, num_lines - 1) 

            if rand_index not in blackList:
                blackList.append(rand_index)
                break
    else: #random index is not in the list - unique value
        blackList.append(rand_index)   

    ticker, issuer, name = random_line
    
    #insert the values into the table - cos730_db

    cur = conn.cursor()

    cur.execute("INSERT INTO etf(ticker, issuer, name) VALUES(%s, %s, %s)", (ticker,issuer,name))

    conn.commit()

cur.close()
conn.close()

print("Done Inserting Data!")




