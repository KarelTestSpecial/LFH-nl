import json

def parse_line(line):
    """Parses a single line to get its indentation level and title."""
    stripped_line = line.lstrip(' ')
    indentation = len(line) - len(stripped_line)
    title = stripped_line.strip()
    # Assuming 8 spaces per indentation level
    level = indentation // 8
    return level, title

def build_hierarchy(lines):
    """Builds a hierarchical structure from a list of lines."""
    if not lines:
        return []

    # The root of our final JSON structure
    root = []
    # A stack to keep track of the parent nodes at each level
    # We initialize it with the root list
    parent_stack = { -1: root }

    for line in lines:
        if not line.strip():
            continue

        level, title = parse_line(line)

        node = {
            "title": title,
            "children": []
        }

        # Get the correct parent from the stack and add the new node
        parent = parent_stack[level - 1]
        parent.append(node)

        # Update the stack for the current level
        parent_stack[level] = node["children"]

    return root

def main():
    """Main function to read the outline, parse it, and write to JSON."""
    try:
        with open('LFHoutline.txt', 'r', encoding='utf-8') as f:
            # The first line is a UTF-8 BOM in the provided file, skip it if present
            content = f.read()
            if content.startswith('\ufeff'):
                content = content[1:]
            lines = content.splitlines()

        hierarchy = build_hierarchy(lines)

        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(hierarchy, f, indent=4, ensure_ascii=False)

        print("Successfully converted LFHoutline.txt to data.json")

    except FileNotFoundError:
        print("Error: LFHoutline.txt not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
