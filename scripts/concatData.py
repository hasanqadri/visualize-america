
s = ["county","office","district","party","candidate","votes", "electionType", "year"]


import os
import csv

# df = pd.read_csv('/path/to/sample.csv')
# df_reorder = df[['A', 'B', 'C', 'D', 'E']] # rearrange column here
# df_reorder.to_csv('/path/to/sample_reorder.csv', index=False)
c = csv.writer(open("data.csv", "wb"))
c.writerow(s)
from collections import defaultdict

dd = defaultdict(float)
for root, subdirs, files in os.walk("."):
    if ".csv" in files[0]:
    	for f in files:
    		electionType = ""
    		filename = root + "/"+ f
    		year = root.replace("./Data/","")
    		if not ("ga__primary.csv" in filename or "ga__general.csv" in filename or "ga__general1111.csv" in filename):
    			continue

    		if ("ga__primary.csv" in filename):
    			electionType = "primary"
    		elif ("ga__general.csv" in filename):
    			electionType = "general"    				

    		content = []
    		with open(filename) as f:
    			content = f.readlines()
    		
	    	fieldNames = content[0].split(",")[:6]

	    	data = content[1:]

	    	for line in data:
				line = [line.strip() for line in line.split(",")[:6]] #line[:6]
				line.append(electionType)
				line.append(year)
				c.writerow(line)
