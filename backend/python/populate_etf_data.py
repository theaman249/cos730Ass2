import csv
import random
import psycopg2
import json


risk = ['low','moderate','high']


def hasDuplicates(my_list):
  return len(set(my_list)) != len(my_list)

def generateReturnYTD():
  # Generate a random number between 0 and 10
  random_number = random.uniform(0, 100)

  # Convert the random number to a float with 2 decimal places
  formatted_number = round(random_number, 2)

  return formatted_number

# True represents a positive
# False represents a negative

def positiveOrNegative():
    random_number = random.randint(0,10)

    if(random_number >= 5):
        return True
    else: 
        return False


conn = psycopg2.connect(
    database = "cos730_db", 
    user = "postgres", 
    host= 'localhost',
    password = "admin",
    port = 5432
)

with open('ETFG_INDP.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file) #by default, it's expecting values seperated by a comma
    lines = list(csv_reader) # Convert the reader object to a list

# check the number of lines read
num_lines = len(lines)
blackList = []

for i in range(200):
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

    ticker, issuer, name = random_line

    #Generate other auxillary values

    random_risk_number = random.randint(0,2) #rand_int includes the last value
    
    risk_rating = risk[random_risk_number]

    volume = random.randint(100000,650000)

    ytd_return = generateReturnYTD()

    if(positiveOrNegative() == False):
        ytd_return = ytd_return * -1; 

    
    #insert the values into the table - cos730_db

    cur = conn.cursor()

    cur.execute("INSERT INTO etf VALUES(%s, %s, %s,%s,%s,%s)", (ticker,issuer,name,risk_rating,volume,ytd_return))

    conn.commit()


print("INSERTING ETF DATA - SUCCESS")

cur = conn.cursor()

id = 'U12345678'
fname = 'Khanyi'
lname = 'Gumede'
email = 'khanyi.Gumede@jpmorganchase.com'
company  = 'JP Morgan Chase'
portfolio = """[
  { "ticker": "NVDA", "name": "Nvidia", "price": 924.79 },
  { "ticker": "MSFT", "name": "Microsoft", "price": 420.21},
  { "ticker": "NFLX", "name": "Netflix", "price": 621.10},
  { "ticker": "GE", "name": "General Electric", "price": 159.89},
  { "ticker": "XOM", "name": "Exxon Mobil", "price": 119.64},
  { "ticker": "XAU/USD", "name": "Gold Spot US Dollar", "price": 2414.70},
  { "ticker": "USD/ZAR", "name": "US Dollar South African Rand ", "price": 18.14}
]"""
role = "senior analyst"

cur.execute("INSERT INTO users VALUES(%s,%s,%s,%s,%s,%s,%s)",(id,fname,lname,email,company,json.dumps(portfolio),role))
conn.commit()

cur.close()
conn.close()

print("INSERTING USER DATA - SUCCESS")
