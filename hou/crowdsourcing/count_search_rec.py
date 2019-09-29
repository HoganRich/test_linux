from pyspark import SparkContext
from pyspark.sql import SQLContext
import sys
import os
os.environ["SPARK_HOME"] = "/Users/a6/Applications/spark-2.1.0-bin-hadoop2.6"


if __name__ == "__main__":
    sc = SparkContext(appName="mysqltest")
    sqlContext = SQLContext(sc)
    df = sqlContext.read.format("jdbc").options(
        url="jdbc:mysql://120.77.144.237/crowdsourcing?user=crowdsourcing&passwd=hhy19980615", dbtable="T_SEARCH_REC").load()
    df.show()
    sc.stop()
