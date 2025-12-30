import os
import shutil
import zipfile
from pathlib import Path

# Source and destination paths
source_dir = r"C:\Users\thisy\Downloads\Online-House-Rental-and-Tenant-Management-System-main\Online-House-Rental-Tenant-Management-System-main"
dest_dir = r"C:\Users\thisy\Downloads\Online-House-Rental-and-Tenant-Management-System-main\Haven-Rental-Platform-Sharable"
zip_file = r"C:\Users\thisy\Downloads\Online-House-Rental-and-Tenant-Management-System-main\Haven-Rental-Platform.zip"

# Directories and files to exclude
exclude_dirs = {'node_modules', '.git', '.angular', '__pycache__', 'dist', '.vscode'}
exclude_files = {'.env', '*.log'}

print("Starting copy process...")

# Remove destination if it exists
if os.path.exists(dest_dir):
    print(f"Destination directory exists, will overwrite: {dest_dir}")
    try:
        shutil.rmtree(dest_dir)
    except Exception as e:
        print(f"Warning: Could not remove existing directory: {e}")
        print("Will attempt to overwrite files...")

# Create destination directory
os.makedirs(dest_dir, exist_ok=True)
print(f"Using directory: {dest_dir}")

# Copy files with exclusions
def should_exclude(path, excluded_dirs, excluded_files):
    path_parts = Path(path).parts
    # Check if any excluded directory is in the path
    for exclude_dir in excluded_dirs:
        if exclude_dir in path_parts:
            return True
    # Check if filename matches any excluded pattern
    filename = os.path.basename(path)
    if filename in excluded_files or filename.endswith('.log'):
        return True
    return False

copied_count = 0
skipped_count = 0

for root, dirs, files in os.walk(source_dir):
    # Calculate relative path
    rel_path = os.path.relpath(root, source_dir)
    dest_path = os.path.join(dest_dir, rel_path) if rel_path != '.' else dest_dir
    
    # Filter out excluded directories
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    # Create destination directory
    if not should_exclude(root, exclude_dirs, exclude_files):
        os.makedirs(dest_path, exist_ok=True)
        
        # Copy files
        for file in files:
            source_file = os.path.join(root, file)
            if not should_exclude(source_file, exclude_dirs, exclude_files):
                dest_file = os.path.join(dest_path, file)
                try:
                    shutil.copy2(source_file, dest_file)
                    copied_count += 1
                    if copied_count % 100 == 0:
                        print(f"Copied {copied_count} files...")
                except Exception as e:
                    print(f"Error copying {source_file}: {e}")
                    skipped_count += 1
            else:
                skipped_count += 1

print(f"\nCopy complete! Copied {copied_count} files, skipped {skipped_count} files/folders")

# Update environment.ts to remove API key
env_file = os.path.join(dest_dir, 'frontend', 'src', 'environments', 'environment.ts')
if os.path.exists(env_file):
    print(f"\nUpdating environment file: {env_file}")
    with open(env_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace API key with placeholder
    import re
    content = re.sub(r"geminiApiKey: '[^']*'", "geminiApiKey: 'YOUR_GEMINI_API_KEY_HERE'", content)
    
    with open(env_file, 'w', encoding='utf-8') as f:
        f.write(content)
    print("API key removed from environment file")
else:
    print(f"Warning: Environment file not found at {env_file}")

# Remove .env file from backend if it exists
backend_env = os.path.join(dest_dir, 'backend', '.env')
if os.path.exists(backend_env):
    print(f"\nRemoving backend .env file: {backend_env}")
    os.remove(backend_env)
    print("Backend .env file removed")

# Create .env.example in backend
backend_env_example = os.path.join(dest_dir, 'backend', '.env.example')
env_example_content = """# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=house_rental_db
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration (change in production)
JWT_SECRET=your_super_secret_jwt_key_change_in_production
"""

with open(backend_env_example, 'w', encoding='utf-8') as f:
    f.write(env_example_content)
print(f"Created .env.example file in backend")

# Create ZIP file
print(f"\nCreating ZIP file: {zip_file}")
if os.path.exists(zip_file):
    os.remove(zip_file)

file_count = 0
with zipfile.ZipFile(zip_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dest_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, os.path.dirname(dest_dir))
            zipf.write(file_path, arcname)
            file_count += 1
            if file_count % 100 == 0:
                print(f"Zipped {file_count} files...")

print(f"\nZIP creation complete! Total files in ZIP: {file_count}")
print(f"\nShareable package created successfully!")
print(f"Location: {zip_file}")
print(f"Size: {os.path.getsize(zip_file) / (1024 * 1024):.2f} MB")

