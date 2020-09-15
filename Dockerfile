# FROM python:3.8
FROM ubuntu:bionic
RUN apt-get update
RUN apt-get install -y python-opencv
RUN apt install -y python3-pip
VOLUME ./src /src
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY src/ .
CMD [ "python", "main.py" ]

