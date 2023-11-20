Implementation on linux environment or servers, like Google Cloud Platform 

- Using Anaconda list the environment \
`$ conda env list`
such as facewise-project

- Python \
current version python 3.9

- Create/activate the new environment to use it \
`conda activate facewise-project`

- Install required packages \
`$ pip install -r requirements.txt`

- To execute Facewise Low MAST ver `templates/facewise/facewise-low-mast.html`, add `/facewisenewlm` to server address \
ex) http://analog-height-296717.uc.r.appspot.com/facewisenewlm

- To execute Facewise High MAST ver `templates/facewise/facewise-new.html`, add `/facewisenew` to server address \
ex) http://analog-height-296717.uc.r.appspot.com/facewisenew

- To change the collected data location, change the key of `datastore.Entity` in `/main.py` Line 72

- Install CORS for Chrome/Firefox/Opera/Edge (More information [here](https://www.youtube.com/watch?v=KruSUqLdxQA))
