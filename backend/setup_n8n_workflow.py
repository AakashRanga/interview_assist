"""
Script to create and activate n8n workflow via API (no UI needed)
"""
import requests
import json
import sys

N8N_URL = "http://localhost:5678"

def load_workflow(file_path):
    """Load workflow from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_workflow(workflow_data):
    """Create workflow in n8n"""
    url = f"{N8N_URL}/rest/workflows"
    response = requests.post(url, json=workflow_data)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error creating workflow: {response.status_code}")
        print(response.text)
        return None

def activate_workflow(workflow_id):
    """Activate a workflow"""
    url = f"{N8N_URL}/rest/workflows/{workflow_id}/activate"
    response = requests.post(url)

    if response.status_code == 200:
        print(f"✓ Workflow {workflow_id} activated successfully")
        return True
    else:
        print(f"Error activating workflow: {response.status_code}")
        print(response.text)
        return False

def list_workflows():
    """List all workflows"""
    url = f"{N8N_URL}/rest/workflows"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    return []

def main():
    # Check if n8n is running
    try:
        response = requests.get(N8N_URL)
        print("✓ Connected to n8n")
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to n8n. Is n8n running at localhost:5678?")
        sys.exit(1)

    # Load workflow
    print("Loading workflow from n8n.json...")
    workflow_data = load_workflow("../n8n.json")

    # Create workflow
    print("Creating workflow...")
    result = create_workflow(workflow_data)

    if result:
        workflow_id = result.get("id")
        print(f"✓ Workflow created with ID: {workflow_id}")

        # Activate workflow
        print("Activating workflow...")
        activate_workflow(workflow_id)
    else:
        # Check if workflow already exists
        print("Checking for existing workflow...")
        workflows = list_workflows()
        for wf in workflows:
            if wf.get("name") == "Interview Scheduler":
                workflow_id = wf.get("id")
                print(f"Found existing workflow ID: {workflow_id}")
                activate_workflow(workflow_id)
                break
        else:
            print("Failed to create or find workflow")

if __name__ == "__main__":
    main()