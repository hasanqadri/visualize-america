# Python 2.x version
import csv
import json


csv_dict_writer("./arizona.csv", "./arizona.json")
#----------------------------------------------------------------------
def csv_dict_writer(csvPath, jsonPath):
    csvfile = open("./arizona.csv", 'r')
    jsonfile = open("./arizona.json", 'w')
    reader = csv.DictReader(csvfile)
    out = json.dumps( [ row for row in reader ] )
    jsonfile.write(out)


{STATE: {poll: , Date: , Sample: , MoE: , Spread: , Candidates { Name1: , Name2: , Name3: }}}
