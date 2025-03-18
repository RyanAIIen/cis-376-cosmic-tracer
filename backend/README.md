# CIS-376 Cosmic Tracer Backend

## Installation

Confirm you have Python 3.8 or higher installed by running `python --version` in
a terminal. If not, you can install it from the [Python Website](https://www.python.org/downloads/).

Then install the project dependency packages using `pip`:

```bash
python -m pip install -r requirements.txt
```

If you do not want to install the dependencies globally, you can use a
[virtual environment](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/).

```sh
# Create the virtual environment
python -m venv venv

# Activate the virtual environment:
# in Linux & macOS
. venv/bin/activate
# or Windows
.\venv\Scripts\activate

# Install the dependencies
pip install -r requirements.txt
```

**Note:** You will have to reactivate the virtual environment any time you begin
a new terminal session.

## Running the Application

For development and demo purposes, this project uses a sqlite database.
Run the database migrations to create the database:

```sh
python manage.py migrate
```

Then run the built in development server:

```sh
python manage.py runserver
```

You can now view the API running in your browser: http://localhost:8000.

Login to the API Admin site ([/admin](http://localhost:8000/admin)) using the
development superuser credentials:

```env
AUTH_SUPERUSER_EMAIL='admin@example.com'
AUTH_SUPERUSER_PASSWORD='goblue!'
```

These values and all other environment variables can be modified in
the `.env.dev` file.

## Learning Resources

To learn more about the project tools, take a look at the following resources:

- [Django Documentation](https://docs.djangoproject.com/en/5.0/)
