FROM ubuntu:bionic AS base
RUN apt-get update
RUN apt-get install -y python-opencv

FROM base AS base-python
RUN apt install -y python3-pip
FROM  base-python AS project

FROM base-python AS base-project
VOLUME ./src /src
COPY requirements.txt .
RUN pip3 install -r requirements.txt
COPY src/ .
CMD [ "python", "main.py" ]

