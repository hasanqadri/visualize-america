# Learned to do this from :
# http://stackoverflow.com/questions/11033590/change-specific-value-in-csv-file-via-python

import csv
import os

def addCandidateParty(year, office):

    for filename in os.listdir("../Data/{}/".format(year)):
        if "20161108__ga__general__" in filename:
            with open("../Data/{}/{}".format(year, filename)) as f:
                reader = csv.reader(f)
                lines = [l for l in reader]
                for line in lines:
                    if office in line[2]:
                        if line[5] == "DONALD J. TRUMP" or line[5] == "JOHNNY ISAKSON ":
                            line[4] = "REP"
                        elif line[5] == "HILLARY CLINTON" or line[5] == "JIM BARKSDALE":
                            line[4] = "DEM"
                        elif line[5] == "GARY JOHNSON" or line[5] == "ALLEN BUCKLEY":
                            line[4] = "IND"
                        #print line
                writer = csv.writer(open("../Data/{}/{}".format(year, filename), 'w'))
                writer.writerows(lines)

def main():
    #addCandidateParty("2016", "President of the United States")
    addCandidateParty("2016", "United States Senator")

main()
