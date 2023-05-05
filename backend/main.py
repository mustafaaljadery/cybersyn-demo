#!/usr/bin/env python
import snowflake.connector
import pandas as pd
from pandasai import PandasAI
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

session= snowflake.connector.connect(
   account=  "SESSION-ACCOUNT",
   user= "SNOWFLAKE-USER",
   password= "SNOWFLAKE-PASSWORD",
   warehouse= "SNOWFLAKE-WAREHOUSE",
   role= "accountadmin",
   database= "SNOWFLAKE-DATABASE",
   schema= "public").cursor()

def fetch_pandas_old(cur, sql):
    cur.execute(sql)
    dat = cur.fetchall()
    cols = []
    for col in cur.description:
      cols.append(col.name)
    return pd.DataFrame(dat, columns=cols)

# Example query
df = fetch_pandas_old(session, "SELECT * FROM ECONOMY_DATA_ATLAS.ECONOMY.BEANIPA WHERE \"Indicator Name\" = 'Personal consumption expenditures (PCE)' AND \"Frequency\" = 'A' ORDER BY \"Date\"")

# Instantiate a LLM
from pandasai.llm.openai import OpenAI
llm = OpenAI(api_token="OPENAI-API-TOKEN")
pandas_ai = PandasAI(llm)

@app.route('/search', methods=["GET"])
def search():
  q = request.args.get('q')
  answer = pandas_ai.run(df, prompt=q)
  return dict({"answer": answer, "question": q})

if __name__ == '__main__':
  app.run(debug =True)
