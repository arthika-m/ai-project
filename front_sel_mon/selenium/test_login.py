
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

BASE_URL = "http://localhost:5000/"

# Use your registered account
VALID_EMAIL = "muruga@gmail.com"
VALID_PASSWORD = "muruga"

try:
    # 1. Interface Testing
    driver.get(BASE_URL)

    email = wait.until(
        EC.visibility_of_element_located((By.ID, "email"))
    )
    password = driver.find_element(By.ID, "password")
    login_button = driver.find_element(
        By.CSS_SELECTOR, "input[type='submit']"
    )

    assert email.is_displayed()
    assert password.is_displayed()
    assert login_button.is_displayed()

    print("Interface Test Passed")

    # 2. Valid Login Testing
    email.send_keys(VALID_EMAIL)
    password.send_keys(VALID_PASSWORD)
    login_button.click()

    alert = wait.until(EC.alert_is_present())
    print("Login response:", alert.text)
    alert.accept()

    wait.until(EC.url_contains("dashboard.html"))
    print("Valid Login Test Passed")

    # 3. Invalid Login Testing
    driver.get(BASE_URL)

    email = wait.until(
        EC.visibility_of_element_located((By.ID, "email"))
    )
    password = driver.find_element(By.ID, "password")
    login_button = driver.find_element(
        By.CSS_SELECTOR, "input[type='submit']"
    )

    email.send_keys(VALID_EMAIL)
    password.send_keys("WrongPassword123")
    login_button.click()

    try:
        alert = wait.until(EC.alert_is_present())
        print("Invalid login response:", alert.text)
        alert.accept()
        print("Invalid Login Test Passed")

    except TimeoutException:
        print("Invalid Login Test Failed: No alert appeared")

    print("Testing completed")

finally:
    driver.quit()
