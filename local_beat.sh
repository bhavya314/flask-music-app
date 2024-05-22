#! /bin/sh
echo "==================================================="
echo "Welcom to the setup. This will setup the local virtual env."
echo "And then it will install all the required python libraried."
echo "You can rerun this without any issues."
echo "---------------------------------------------------"


celery -A main.celery beat --max-interval 1 -l info