from flask import Flask, request, render_template, make_response, redirect, url_for, send_from_directory
import sqlite3
from datetime import datetime
import os
import json

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.before_first_request
def create_table():
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    cursor.execute("""CREATE TABLE IF NOT EXISTS USERS(
            EMAIL TEXT PRIMARY KEY NOT NULL,
            FULL_NAME TEXT NOT NULL,
            CONTACT_NUMBER INTEGER NOT NULL,
            PASSWORD TEXT NOT NULL,
            GENDER TEXT,
            BATCH TEXT
        );
    """)

    cursor.execute("""CREATE TABLE IF NOT EXISTS POSTS (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        WHAT TEXT NOT NULL,
        CONTACT_NUM TEXT NOT NULL,
        DATE TEXT,
        LOCATION TEXT,
        PRICE TEXT,
        TIME TEXT,
        CATEGORY TEXT NOT NULL,
        TYPE_OF_POST TEXT NOT NULL,
        ACTIVE INTEGER NOT NULL,
        EMAIL TEXT,
        TIME_OF_POST TEXT,
        IMAGE TEXT,
        DESCRIPTION TEXT,
        FOREIGN KEY (EMAIL) REFERENCES USERS(EMAIL)
    );
    """)

    connection.commit()

def check_cookie(email):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT EMAIL FROM USERS WHERE EMAIL='"+email+"'")
    return cursor.fetchone() is not None
    
@app.route("/", methods=['GET'])
def home():
    text = "LOGIN"
    if 'email' in request.cookies and check_cookie(request.cookies['email']):
        text = "LOGOUT"
    return render_template("home.html", text=text)

@app.route("/about")
def about():
    text = "LOGIN"
    if 'email' in request.cookies and check_cookie(request.cookies['email']):
        text = "LOGOUT"
    return render_template("about.html", text=text)

@app.route("/login", methods=["GET"])
def login_form():
    if 'email' in request.cookies and check_cookie(request.cookies['email']):
        return redirect(url_for("home"))
    return render_template("login.html")

@app.route("/register", methods=['GET'])
def reg_form():
    return render_template("register.html")

@app.route("/all-posts")
def all_posts():
    text = "LOGIN"
    if 'email' in request.cookies and check_cookie(request.cookies['email']):
        text = "LOGOUT"
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM POSTS ORDER BY ID DESC")
    data = cursor.fetchall()
    print(data)
    return render_template("all-posts.html", posts=data, text=text)

@app.route("/post/<type>", methods=["GET"])
def type_form(type):
    session = request.cookies
    if 'email' in session and check_cookie(request.cookies['email']):
        email = session['email']
        return render_template(type+".html", email=email)
    return redirect(url_for("login"))    

@app.route("/post/<type>", methods=['POST'])
def add_post(type):
    session = request.cookies
    if 'email' in session and check_cookie(request.cookies['email']):
        data = request.form
        email = session.get('email')
        date = ""
        location = ""
        time = ""
        price = ""
        if 'price' in data:
            price = data['price']
        if 'date' in data:
            date = data['date']
        if 'location' in data:
            location = data['location']
        if 'time' in data:
            time = data['time']
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        cursor.execute("SELECT MAX(ID) FROM POSTS")
        count = cursor.fetchone()
        if None in count:
            count = 0
        else:
            count = count[0]
        image = ""
        if 'image' in request.files:
            image = request.files['image']
        filename = ""
        extension = ""
        if image:
            filename = "image-post-"+str(count+1)
            extension = os.path.splitext(image.filename)[1]
            image.save(os.path.join("static/images",filename+extension))

        cursor.execute(f"INSERT INTO POSTS  (WHAT, CONTACT_NUM, DATE, LOCATION, PRICE, TIME, CATEGORY, TYPE_OF_POST, ACTIVE, EMAIL, TIME_OF_POST, IMAGE, DESCRIPTION) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", (data['what'], data['contacts'], date, location, price, time, data['type'], type, 1, email, dt_string, "images/"+filename+extension if image else "", data['desc'])) 
        connection.commit()
        cursor.execute("SELECT MAX(ID) FROM POSTS")
        count = cursor.fetchone()[0]
        print("Inserted post #"+str(count))

        connection.close()
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))

@app.route("/get-data/<type>", methods=['GET'])
def send_posts(type):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    data = []
    if "+" not in type:
        if type == "all":
            cursor.execute("SELECT * FROM POSTS")
            data = cursor.fetchall()
        else:
            cursor.execute("SELECT * FROM POSTS WHERE TYPE_OF_POST"+type)
            data = cursor.fetchall()
    else:
        types = tuple(type.split("+"))
        cursor.execute("SELECT * FROM POSTS WHERE TYPE_OF_POST IN %s", (types,))
        data = cursor.fetchall()
    return data

@app.route("/dashboard", methods=['GET'])
def dashboard():
    if 'email' in request.cookies and check_cookie(request.cookies['email']):
        email = request.cookies['email']
        connection = sqlite3.connect("database.db")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM USERS WHERE EMAIL='"+email+"'")
        data = cursor.fetchone()
        cursor.execute("SELECT * FROM POSTS WHERE EMAIL='"+email+"' ORDER BY ID DESC")
        posts = cursor.fetchall()
        connection.close()
        print(posts)
        return render_template("user-page.html", data=data, posts=posts)
    return redirect(url_for("login"))

@app.route("/get-user-data/<email>")
def send_user(email):
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM USERS WHERE EMAIL='"+email+"'")
    data = cursor.fetchone()
    dat = {
        "email": data[0],
        "name": data[1],
        "num": data[2],
        "batch": data[5]
    }
    return json.dumps(dat)

# @app.route("/get-user-posts/", methods=['POST'])
# def send_user_posts():
#     email = request.get_json()['email']
#     connection = sqlite3.connect("database.db")
#     cursor = connection.cursor()
#     cursor.execute("SELECT * FROM POSTS WHERE EMAIL="+email)
#     data = cursor.fetchall()
#     data = [list(elem) for elem in data]
#     return data

@app.route("/delete-post/", methods=['POST'])
def remove_user_post():
    id = request.get_json()['id'] 
    email = request.cookies['email']
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT EMAIL FROM POSTS WHERE ID="+id)
    data = cursor.fetchone()
    if data != None and data[0] == email:
        cursor.execute("DELETE FROM POSTS WHERE ID="+id)
        connection.commit()
        connection.close()
        print("Deleted #"+id)
        os.remove(os.path.join('static/images',"image-post-"+id))
        return redirect(url_for("dashboard"))
    else:
        return "Bad Request: Cheater boii!"

@app.route("/register", methods=['POST'])
def register():
    data = request.form
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT EMAIL FROM USERS WHERE EMAIL='"+data['email']+"'")
    if cursor.fetchall() != []:
        return "User with that email already exists."
    cursor.execute("INSERT INTO USERS (EMAIL, FULL_NAME, PASSWORD, CONTACT_NUMBER, GENDER, BATCH) VALUES (?,?,?,?,?,?)", (data['email'], data['name'], data['password'], data['contacts'], data['gender'], data['batch']))
    connection.commit()
    connection.close()
    response = make_response(redirect(url_for('home')))
    response.set_cookie('email', data['email'])
    return response

@app.route("/login", methods=['POST'])
def login():
    data = request.form
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()
    cursor.execute("SELECT PASSWORD FROM USERS WHERE EMAIL='"+data['email']+"'")
    password = cursor.fetchone()
    if password != None and password[0] == data['password']:
        response = make_response(redirect(url_for('home')))
        response.set_cookie('email', data['email'])
        return response
    return "Incorrect email or password"

@app.route("/logout")
def logout():
    response = make_response(redirect(url_for('login')))
    response.set_cookie('email', '', expires=0)
    return response


if __name__ == "__main__":
    app.run(debug=True)
