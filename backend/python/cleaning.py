import csv

# Input and output file names
input_file = 'sentiment.csv'
output_file = 'cleaned.csv'

# Read the CSV data
with open(input_file, 'r') as infile:
    reader = csv.DictReader(infile)
    rows = list(reader)

# Use a set to track seen tickers and a list to store unique rows
seen_tickers = set()
unique_rows = []

# Iterate over the rows and add unique rows to the list
for row in rows:
    if row['ticker'] not in seen_tickers:
        unique_rows.append(row)
        seen_tickers.add(row['ticker'])

# Write the unique rows to the new CSV file
with open(output_file, 'w', newline='') as outfile:
    fieldnames = ['ticker', 'name', 'sentiment']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(unique_rows)

print(f"Data cleaned and saved to {output_file}")
