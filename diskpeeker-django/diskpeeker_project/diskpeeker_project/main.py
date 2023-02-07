# Entry point file for shipping via shiv 

import os
import sys

import django

def main() -> None:
    # setup django
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "prod":
            run_gunicorn(sys.argv)
        elif sys.argv[1] == "manage":
            run_manage(sys.argv)
    else:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "diskpeeker_project.settings")
        django.setup()

        from django.core.management import call_command
        from django.core.wsgi import get_wsgi_application 
        application = get_wsgi_application()
        call_command('runserver',  '127.0.0.1:6064')

def run_gunicorn(argv: list) -> None:
    """Run the web server."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "diskpeeker_project.settings")
    django.setup()

    import gunicorn.app.wsgiapp as wsgi

    # This is just a simple way to supply args to gunicorn
    sys.argv = [".", "diskpeeker_project.wsgi", "--bind=0.0.0.0:6064"]
    wsgi.run()

def run_manage(argv: list) -> None:
    """Run Django's manage command."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "diskpeeker_project.settings")
    django.setup()

    from django.core.management import execute_from_command_line

    execute_from_command_line(argv[1:])

if __name__ == "__main__":
    main()