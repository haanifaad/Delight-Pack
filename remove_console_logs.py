import os
import re

def remove_console_logs(directory):
    count = 0
    pattern = re.compile(r'^\s*console\.log\s*\(.*?\)\s*;?\s*$', re.MULTILINE)
    
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.next' in dirs:
            dirs.remove('.next')
        if 'build' in dirs:
            dirs.remove('build')
        
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content, num_subs = pattern.subn('', content)
                    
                    if num_subs > 0:
                        count += num_subs
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                except Exception as e:
                    pass
    return count

if __name__ == "__main__":
    web_portal_count = remove_console_logs('c:/Projects/dp/web_portal')
    backend_count = remove_console_logs('c:/Projects/dp/backend')
    total = web_portal_count + backend_count
    print(f"Removed {total} console.log statements.")
