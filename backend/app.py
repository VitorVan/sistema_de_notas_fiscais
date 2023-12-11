import os
import shutil
import uuid
from donut import DonutModel
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time

from getReceiptData import getData


app = FastAPI()

origins = [
    "http://localhost:5173",
]

@app.post("/receipt")
def getReceiptHandler(file: UploadFile):
  print(file.filename)
  if not file.filename.endswith(".png") and not file.filename.endswith(".jpg") and not file.filename.endswith(".jpeg"):
    raise HTTPException(status_code=401, detail="Arquivo deve estar em .png, .jpg ou .jpeg")
  

  generatedUuid = str(uuid.uuid4())
  file_path = f"data/upload/{generatedUuid + os.path.splitext(file.filename)[1]}"

  with open(file_path, "wb") as buffer:
    shutil.copyfileobj(file.file, buffer)
  
  start_time = time.time()
  receiptData = getData(file_path)
  end_time = time.time()
  elapsed_time = end_time - start_time
  elapsed_time = round(elapsed_time)
  print(f"Time taken: {elapsed_time}")
  print(receiptData)


  return {
    "receiptData": receiptData,
    "id": generatedUuid,
    "time": elapsed_time
  }

@app.get("/")
async def root():
    return {
  "company": "MERCEARIA CHAMA LTDA",
  "address": "RUA PRESIDENTE COSTA E SILVA, 901 - Nao Informado HELENA MARIA, OSASCO, CEP: 06253-000",
  "cnpj": "03.205.493/0011-66",
  "total": "37.44",
  "menu": [
    {
      "nm": "CENOURA BDJ 500G",
      "cnt": "1",
      "unit": "2.99",
      "price": "2.99"
    },
    {
      "nm": "PAO FORM VISCONTI",
      "cnt": "1",
      "unit": "5.99",
      "price": "5.99"
    },
    {
      "nm": "TORRADA VISCONTI MU",
      "cnt": "1",
      "unit": "3.99",
      "price": "3.99"
    },
    {
      "nm": "ABOBORA ITALIA 400",
      "cnt": "1",
      "unit": "3.49",
      "price": "3.49"
    },
    {
      "nm": "ERVAS AROMATICAS P",
      "cnt": "1",
      "unit": "7.99",
      "price": "7.99"
    },
    {
      "nm": "APHELANDRA P15",
      "cnt": "1",
      "unit": "12.99",
      "price": "12.99"
    }
  ]
}


    

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == '__main__':
    uvicorn.run("app:app", host="127.0.0.1",port=8000, reload=True)