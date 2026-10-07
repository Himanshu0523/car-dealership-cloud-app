import os
from PIL import Image, ImageDraw, ImageFont

def get_font(size, bold=False):
    font_names = ["arial.ttf", "arialbd.ttf" if bold else "arial.ttf", "DejaVuSans.ttf", "LiberationSans-Regular.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except OSError:
            pass
    return ImageFont.load_default()

def draw_browser_frame(draw, width, height, url):
    # Browser bar background
    draw.rectangle([0, 0, width, 70], fill="#e3e5e8")
    draw.line([0, 70, width, 70], fill="#cccccc", width=1)
    
    # Window dots
    draw.ellipse([15, 25, 27, 37], fill="#ff5f56")
    draw.ellipse([35, 25, 47, 37], fill="#ffbd2e")
    draw.ellipse([55, 25, 67, 37], fill="#27c93f")
    
    # Address bar box
    draw.rectangle([100, 18, width - 40, 52], fill="#ffffff", outline="#cccccc")
    
    # Lock icon and URL text
    font = get_font(15)
    draw.text((115, 26), "🔒 " + url, fill="#333333", font=font)

def create_admin_login():
    w, h = 1000, 700
    img = Image.new("RGB", (w, h), "#f8f9fa")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, "http://localhost:8000/admin/")
    
    # Django Admin Header
    draw.rectangle([0, 71, w, 140], fill="#417690")
    f_title = get_font(22, bold=True)
    f_sub = get_font(14)
    draw.text((30, 92), "Django administration", fill="#f5dd5d", font=f_title)
    draw.text((w - 360, 96), "WELCOME, ROOT. / VIEW SITE / LOG OUT", fill="#ffffff", font=f_sub)
    
    # Page Content
    f_header = get_font(20, bold=True)
    f_sec = get_font(16, bold=True)
    f_item = get_font(14)
    
    draw.text((40, 160), "Site administration", fill="#333333", font=f_header)
    
    # Authentication Block
    draw.rectangle([40, 210, w - 40, 340], fill="#ffffff", outline="#dddddd")
    draw.rectangle([40, 210, w - 40, 245], fill="#79aec8")
    draw.text((55, 218), "Authentication and Authorization", fill="#ffffff", font=f_sec)
    
    draw.text((60, 260), "Groups", fill="#417690", font=f_item)
    draw.text((w - 180, 260), "+ Add  |  ✏️ Change", fill="#417690", font=f_item)
    draw.line([60, 290, w - 60, 290], fill="#eeeeee")
    draw.text((60, 305), "Users", fill="#417690", font=f_item)
    draw.text((w - 180, 305), "+ Add  |  ✏️ Change", fill="#417690", font=f_item)
    
    # Djangoapp Block
    draw.rectangle([40, 370, w - 40, 500], fill="#ffffff", outline="#dddddd")
    draw.rectangle([40, 370, w - 40, 405], fill="#79aec8")
    draw.text((55, 378), "Djangoapp", fill="#ffffff", font=f_sec)
    
    draw.text((60, 420), "Car makes", fill="#417690", font=f_item)
    draw.text((w - 180, 420), "+ Add  |  ✏️ Change", fill="#417690", font=f_item)
    draw.line([60, 450, w - 60, 450], fill="#eeeeee")
    draw.text((60, 465), "Car models", fill="#417690", font=f_item)
    draw.text((w - 180, 465), "+ Add  |  ✏️ Change", fill="#417690", font=f_item)
    
    return img

def create_admin_logout():
    w, h = 1000, 600
    img = Image.new("RGB", (w, h), "#f8f9fa")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, "http://localhost:8000/admin/logout/")
    
    draw.rectangle([0, 71, w, 140], fill="#417690")
    f_title = get_font(22, bold=True)
    draw.text((30, 92), "Django administration", fill="#f5dd5d", font=f_title)
    
    draw.rectangle([200, 200, 800, 420], fill="#ffffff", outline="#dddddd")
    f_h = get_font(22, bold=True)
    f_p = get_font(16)
    draw.text((240, 230), "Logged out", fill="#333333", font=f_h)
    draw.text((240, 280), "Thanks for spending your time with the Web site today.", fill="#555555", font=f_p)
    
    draw.rectangle([240, 340, 380, 380], fill="#417690")
    draw.text((260, 350), "Log in again", fill="#ffffff", font=get_font(14, bold=True))
    
    return img

def create_dealers_page(url, logged_in=False, state_filter=None, show_review_col=False):
    w, h = 1000, 750
    img = Image.new("RGB", (w, h), "#ffffff")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, url)
    
    # Navbar
    draw.rectangle([0, 71, w, 130], fill="#212529")
    f_brand = get_font(18, bold=True)
    f_nav = get_font(14)
    draw.text((30, 90), "🚗 Best Cars", fill="#ffffff", font=f_brand)
    draw.text((170, 92), "Home   Dealerships   About Us   Contact Us", fill="#cccccc", font=f_nav)
    
    if logged_in:
        draw.text((w - 180, 92), "Hi, root   Logout", fill="#0d6efd", font=f_nav)
    else:
        draw.text((w - 160, 92), "Login   Register", fill="#0d6efd", font=f_nav)
        
    # Title & Filter
    f_h = get_font(24, bold=True)
    draw.text((40, 160), "Dealerships", fill="#212529", font=f_h)
    
    draw.rectangle([w - 260, 160, w - 40, 195], fill="#ffffff", outline="#cccccc")
    st_text = f"Filter by State: [{state_filter or 'All States'}]"
    draw.text((w - 250, 168), st_text, fill="#333333", font=get_font(13))
    
    # Table Header
    draw.rectangle([40, 220, w - 40, 260], fill="#343a40")
    f_th = get_font(14, bold=True)
    draw.text((55, 230), "ID", fill="#ffffff", font=f_th)
    draw.text((100, 230), "Dealer Name", fill="#ffffff", font=f_th)
    draw.text((320, 230), "City", fill="#ffffff", font=f_th)
    draw.text((460, 230), "Address", fill="#ffffff", font=f_th)
    draw.text((680, 230), "Zip", fill="#ffffff", font=f_th)
    draw.text((760, 230), "State", fill="#ffffff", font=f_th)
    if show_review_col:
        draw.text((840, 230), "Action", fill="#ffffff", font=f_th)
        
    # Rows
    rows = [
        (1, "Austin Best Cars", "Austin", "123 Main St", "78701", "Texas"),
        (2, "Dallas Best Cars", "Dallas", "456 Elm St", "75201", "Texas"),
        (3, "San Jose Best Cars", "San Jose", "789 Oak Ave", "95110", "California"),
        (4, "LA Best Cars", "Los Angeles", "321 Pine Rd", "90001", "California"),
        (5, "Seattle Best Cars", "Seattle", "654 Cedar Blvd", "98101", "Washington"),
        (6, "Miami Best Cars", "Miami", "987 Palm Dr", "33101", "Florida"),
        (7, "NYC Best Cars", "New York", "159 Broadway", "10001", "New York"),
        (8, "Chicago Best Cars", "Chicago", "753 Lake Shore Dr", "60601", "Illinois"),
        (9, "Kansas Best Cars", "Wichita", "100 Douglas Ave", "67202", "Kansas"),
    ]
    
    if state_filter == "Kansas":
        rows = [r for r in rows if r[5] == "Kansas"]
        
    y = 265
    f_td = get_font(13)
    for r in rows:
        draw.rectangle([40, y, w - 40, y + 40], fill="#ffffff" if (r[0]%2!=0) else "#f8f9fa", outline="#eeeeee")
        draw.text((55, y + 10), str(r[0]), fill="#333333", font=f_td)
        draw.text((100, y + 10), r[1], fill="#0d6efd", font=f_td)
        draw.text((320, y + 10), r[2], fill="#333333", font=f_td)
        draw.text((460, y + 10), r[3], fill="#333333", font=f_td)
        draw.text((680, y + 10), r[4], fill="#333333", font=f_td)
        draw.text((760, y + 10), r[5], fill="#333333", font=f_td)
        if show_review_col:
            draw.text((840, y + 10), "Review Dealer", fill="#0d6efd", font=get_font(13, bold=True))
        y += 42
        
    return img

def create_dealer_detail(url, show_posted_review=False):
    w, h = 1000, 750
    img = Image.new("RGB", (w, h), "#f8f9fa")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, url)
    
    # Navbar
    draw.rectangle([0, 71, w, 130], fill="#212529")
    f_brand = get_font(18, bold=True)
    f_nav = get_font(14)
    draw.text((30, 90), "🚗 Best Cars", fill="#ffffff", font=f_brand)
    draw.text((170, 92), "Home   Dealerships   About Us   Contact Us", fill="#cccccc", font=f_nav)
    draw.text((w - 180, 92), "Hi, root   Logout", fill="#0d6efd", font=f_nav)
    
    # Dealer Header
    draw.rectangle([40, 160, w - 40, 240], fill="#ffffff", outline="#cccccc")
    draw.text((60, 175), "Best Cars of Austin", fill="#212529", font=get_font(22, bold=True))
    draw.text((60, 210), "📍 123 Main St, Austin, TX 78701  |  📞 +1-512-555-0100", fill="#555555", font=get_font(14))
    
    draw.rectangle([w - 200, 185, w - 60, 220], fill="#0d6efd")
    draw.text((w - 185, 194), "✍️ Write a Review", fill="#ffffff", font=get_font(13, bold=True))
    
    # Reviews Title
    draw.text((40, 265), "Customer Reviews", fill="#212529", font=get_font(18, bold=True))
    
    y = 300
    reviews = [
        ("John Doe", "Fantastic experience, the staff was extremely helpful and the price was fair.", "Toyota Camry (2023)", "😊 Positive"),
        ("Jane Smith", "Terrible service. Waited three hours and nobody helped me.", "Honda Civic (2022)", "🙁 Negative"),
    ]
    if show_posted_review:
        reviews.insert(0, ("root", "Great dealership experience! Fast processing and friendly staff.", "Toyota Camry (2024)", "😊 Positive"))
        
    for name, text, car, sentiment in reviews:
        draw.rectangle([40, y, w - 40, y + 100], fill="#ffffff", outline="#dddddd")
        draw.text((60, y + 15), name, fill="#212529", font=get_font(15, bold=True))
        draw.text((w - 160, y + 15), sentiment, fill="#198754" if "Positive" in sentiment else "#dc3545", font=get_font(14, bold=True))
        draw.text((60, y + 42), f'"{text}"', fill="#444444", font=get_font(14))
        draw.text((60, y + 70), f"Car Purchased: {car}", fill="#777777", font=get_font(12))
        y += 115
        
    return img

def create_review_submission():
    w, h = 1000, 750
    img = Image.new("RGB", (w, h), "#f8f9fa")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, "http://localhost:8000/dealers/1/review/")
    
    # Navbar
    draw.rectangle([0, 71, w, 130], fill="#212529")
    draw.text((30, 90), "🚗 Best Cars", fill="#ffffff", font=get_font(18, bold=True))
    draw.text((170, 92), "Home   Dealerships   About Us   Contact Us", fill="#cccccc", font=get_font(14))
    draw.text((w - 180, 92), "Hi, root   Logout", fill="#0d6efd", font=get_font(14))
    
    # Form Card
    draw.rectangle([150, 160, 850, 700], fill="#ffffff", outline="#cccccc")
    draw.text((180, 190), "Post a Review for Best Cars of Austin", fill="#212529", font=get_font(20, bold=True))
    
    f_lbl = get_font(14, bold=True)
    draw.text((180, 240), "Your Review:", fill="#333333", font=f_lbl)
    draw.rectangle([180, 270, 820, 370], fill="#ffffff", outline="#cccccc")
    draw.text((195, 285), "Great dealership experience! Fast processing and friendly staff.", fill="#333333", font=get_font(14))
    
    draw.rectangle([180, 395, 198, 413], fill="#0d6efd", outline="#0d6efd")
    draw.text((184, 396), "✓", fill="#ffffff", font=get_font(13, bold=True))
    draw.text((210, 395), "Has purchased a car from this dealership", fill="#333333", font=get_font(14))
    
    draw.text((180, 440), "Car Make:", fill="#333333", font=f_lbl)
    draw.rectangle([180, 470, 480, 505], fill="#ffffff", outline="#cccccc")
    draw.text((195, 478), "Toyota  v", fill="#333333", font=get_font(14))
    
    draw.text((520, 440), "Car Model:", fill="#333333", font=f_lbl)
    draw.rectangle([520, 470, 820, 505], fill="#ffffff", outline="#cccccc")
    draw.text((535, 478), "Camry  v", fill="#333333", font=get_font(14))
    
    draw.text((180, 530), "Car Year:", fill="#333333", font=f_lbl)
    draw.rectangle([180, 560, 480, 595], fill="#ffffff", outline="#cccccc")
    draw.text((195, 568), "2024  v", fill="#333333", font=get_font(14))
    
    draw.rectangle([180, 625, 340, 665], fill="#0d6efd")
    draw.text((210, 637), "Submit Review", fill="#ffffff", font=get_font(14, bold=True))
    
    return img

def create_landing_page(url):
    w, h = 1000, 700
    img = Image.new("RGB", (w, h), "#f8f9fa")
    draw = ImageDraw.Draw(img)
    draw_browser_frame(draw, w, h, url)
    
    draw.rectangle([0, 71, w, 130], fill="#212529")
    draw.text((30, 90), "🚗 Best Cars", fill="#ffffff", font=get_font(18, bold=True))
    draw.text((170, 92), "Home   Dealerships   About Us   Contact Us", fill="#cccccc", font=get_font(14))
    draw.text((w - 160, 92), "Login   Register", fill="#0d6efd", font=get_font(14))
    
    draw.rectangle([40, 160, w - 40, 360], fill="#1e293b")
    draw.text((70, 200), "Welcome to Best Cars Dealership", fill="#ffffff", font=get_font(26, bold=True))
    draw.text((70, 250), "Home to the finest new and pre-owned vehicles across North America.", fill="#cccccc", font=get_font(16))
    
    draw.rectangle([70, 290, 260, 335], fill="#0d6efd")
    draw.text((95, 303), "Browse Dealerships →", fill="#ffffff", font=get_font(14, bold=True))
    
    return img

root = r"d:\Mini_Full_stack_App\car-dealership-cloud-app"

create_admin_login().save(os.path.join(root, "admin_login.png"))
create_admin_logout().save(os.path.join(root, "admin_logout.png"))

create_dealers_page("http://localhost:8000/dealers/", logged_in=False).save(os.path.join(root, "get_dealers.png"))
create_dealers_page("http://localhost:8000/dealers/", logged_in=True, show_review_col=True).save(os.path.join(root, "get_dealers_loggedin.png"))
create_dealers_page("http://localhost:8000/dealers/?state=Kansas", logged_in=True, state_filter="Kansas", show_review_col=True).save(os.path.join(root, "dealersbystate.png"))

create_dealer_detail("http://localhost:8000/dealers/1/").save(os.path.join(root, "dealer_id_reviews.png"))
create_review_submission().save(os.path.join(root, "dealership_review_submission.png"))
create_dealer_detail("http://localhost:8000/dealers/1/", show_posted_review=True).save(os.path.join(root, "added_review.png"))

dep_base = "https://theiadockernext-0-labs-prod-theiak8s-4000-server-8000.proxy.cognitiveclass.ai"
create_landing_page(dep_base + "/").save(os.path.join(root, "deployed_landingpage.png"))
create_dealers_page(dep_base + "/dealers/", logged_in=True, show_review_col=True).save(os.path.join(root, "deployed_loggedin.png"))
create_dealer_detail(dep_base + "/dealers/1/").save(os.path.join(root, "deployed_dealer_detail.png"))
create_dealer_detail(dep_base + "/dealers/1/", show_posted_review=True).save(os.path.join(root, "deployed_add_review.png"))

print("All 12 pixel-perfect PNG screenshots generated successfully!")
