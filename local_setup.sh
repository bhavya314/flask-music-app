#! /bin/sh
echo "==================================================="
echo "Welcom to the setup. This will setup the local virtual env."
echo "And then it will install all the required python libraried."
echo "You can rerun this without any issues."
echo "---------------------------------------------------"
if [ -d "/.env"];
then
    echo "Virtual environment already exists. Installing using pip"
else
    echo "creating env and install using pip"
    python3 -m venv .env
fi

# activate the virtual environment
. .env/bin/activate

#upgrade the pip
pip install --upgrade pip
pip install -r requirements.txt