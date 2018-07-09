from collections import defaultdict
with open('data.csv', 'r') as f:
	read_data = f.readlines()

'''
###
this file uses the data.csv file to create a simple csv file with aggregated votes per party per year per county
It outputs line0by-line comma separated values
###
'''

print "year,office,county,party,candidate,electionType,votes"

# print read_data[0]
votes = defaultdict(lambda: defaultdict(defaultdict()))
offices = defaultdict(float)

final = defaultdict(dict)
totals = 0
for i,line in enumerate(read_data[1:]):
	
	arr = line.split(",")
	
	if arr[1].strip() in ["President", "U.S. Senate", "US Senate", "United States Senator", "President of the United States"]: 
	
		year = arr[-1].strip()

		county = arr[0].strip().lower()
		office = arr[1].strip().lower()
		party = arr[3].strip().lower()
		candidate = arr[4].strip().lower().replace('\"','')
		electionType = arr[6].strip().lower()						
		votes = arr[5].strip()

		if "lib" in party or party == "l":
			party = "libertarian"
		elif "rep" in party or party == "r":
			party = "republican"
		elif "dem" in party or party == "d":
			party = "democratic"
		if "senat" in office:
			office = "senate"
		elif "pres" in office:
			office = "president" 


		if office not in final[year]:
			final[year][office] = {}
		if county not in final[year][office]:
			final[year][office][county] = {}
		if party not in final[year][office][county]:
			final[year][office][county][party] = {}
		if candidate not in final[year][office][county][party]:
			final[year][office][county][party][candidate] = {}			
		if electionType not in final[year][office][county][party][candidate]:
			final[year][office][county][party][candidate][electionType] = int(votes)
		else:
			final[year][office][county][party][candidate][electionType] += int(votes)	

for k,v in sorted(final.iteritems()):
	for k1,v1 in v.iteritems():
		for k2,v2 in v1.iteritems():
			for k3,v3 in v2.iteritems():
				for k4,v4 in v3.iteritems():
					for k5,v5 in v4.iteritems():
						s = ",".join([k,k1,k2,k3,k4,k5,str(v5)])
						print s