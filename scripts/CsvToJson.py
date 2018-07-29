import csv
import json
comp = []

def makeJSONs(csvfile, state):
    readCSV = csv.reader(csvfile, delimiter=',')
    # iterates through all the rows from the csv
    candidates = {}
    temp = {}
    tempState = {}
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
    tempState[state] = temp
    comp = []
    comp.append(tempState)
    json_string = json.dumps(tempState)
    print(json_string)
    return comp

def readWrite(state):
    stateJson = state + '.json'
    stateCsv = state + '.csv'
    jsonfile = open(stateJson, 'w')
    with open(stateCsv) as csvfile:
        comp = makeJSONs(csvfile, state)
    json.dump(comp, jsonfile, sort_keys=True, indent=4, separators=(',', ': '))

readWrite('arizona')
readWrite('california')
readWrite('massachusetts')
readWrite('new_jersey')
readWrite('new_york')
readWrite('pennsylvania')
readWrite('ohio')
readWrite('virginia')
readWrite('west_virginia')
readWrite('florida')
readWrite('indiana')
readWrite('tennesse')
readWrite('michigan')
readWrite('wisconsin')
readWrite('missouri')
readWrite('north_dakota')
readWrite('texas')
readWrite('montana')
readWrite('utah')
#readWrite('nevada')  # Rename as final
