from donut import DonutModel
from PIL import Image
import torch

def getData(file_path):
  print("Using main getData")
  model = DonutModel.from_pretrained("./data/models/20231204_122304_latest")
  #model = DonutModel.from_pretrained("./result/train_notas/20231013_125739")
  if torch.cuda.is_available():
    model.half()
    device = torch.device("cuda")
    model.to(device)
  else:
    try:
      model.encoder.to(torch.float32)
    except Exception as e:
      print(f"Unable to convert to bfloat16 on CPU: {e}")
  model.eval()
  image = Image.open(file_path).convert("RGB")
  output = model.inference(image=image, prompt="<s_finetuningData>")
  return output

def getData(file_path, model):
  print("Using dev and test getData")
  if torch.cuda.is_available():
    model.half()
    device = torch.device("cuda")
    model.to(device)
  else:
    try:
      model.encoder.to(torch.float32)
    except Exception as e:
      print(f"Unable to convert to bfloat16 on CPU: {e}")
  model.eval()
  image = Image.open(file_path).convert("RGB")
  output = model.inference(image=image, prompt="<s_finetuningData>")
  return output