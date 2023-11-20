### Implementation on linux environment or servers, like GCP

- using Anaconda
list the environment\
`$ conda env list`\
such as readit-project

- python\
current version python 3.10.4

- create/activate the new environment to use it\
  `conda activate readit-project`

- cd 'my-flask" folder and install required packages\
`$ pip install -r requirements.txt`

- install npm nodejs 
 `sudo apt install npm nodejs`

- install yarn 
`sudo npm install -g yarn`

- cd "my-app" folder and run 
`npm install react-scripts@latest` and  `yarn build`

- copy all files under "../my-app/build/static" folder to "../my-flask/static" folder\
copy all rest files under "../my-app/build" folder to "../my-flask/templates" folder


- install and run redis server
`nohup redis-server &`

- back  to "my-flask" folder to run 
`FLASK_APP=app.py flask run --host=0.0.0.0 -p 8989`

