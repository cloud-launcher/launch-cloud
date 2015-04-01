#!/bin/bash

cd .. \
  && gulpur bundle \
  && cd container \
  && rm -rf app \
  && mkdir app \
  && cp ../.dist/app.js app/app.js \
  && sudo docker build -t cloudlauncher/launch-cloud . \
  `# && sudo docker push cloudlauncher/launch-cloud` \
|| echo 'Something went wrong!';


#sudo docker build -t instantchat/benchmarker .
#sudo docker push instantchat/benchmarker