import csv
import json
import sys
import collections
# create a json file (with write access)
jsonfile = open('file.json', 'w')

# hold components
comp = []

# open and load the csv
with open('arizona.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    # iterates through all the rows from the csv
    candidates = {}
    temp = {}
    numCandies = 4;
    for row in readCSV:
        if (row[0] == ''):
            continue
        if (row[0] == 'Poll'):
            i = 4;
            while (row[i] != 'Spread'):
                candidates[i] = row[i]
                i = i + 1
                numCandies = numCandies + 1
        else:
            if (row[0] != 'Poll'):
                numCand = numCandies - 1
                temp[row[0]] = {}
                while (numCand != 3):
                    temp[row[0]][candidates[numCand]] = row[numCand]
                    numCand = numCand - 1
                temp[row[0]]["Spread"] = row[len(row)-1]
    print(temp)
    print(" ")
    comp.append(temp)
    json_string = json.dumps(temp)
    print(json_string)
print("##########")
json.dump(comp, jsonfile, sort_keys=True, indent=4, separators=(',', ': '))
print(jsonfile)
