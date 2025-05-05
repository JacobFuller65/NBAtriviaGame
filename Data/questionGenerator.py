import json
import random

def load_questions(file_path):
    """Load trivia questions from a JSON file."""
    try:
        with open(file_path, 'r') as file:
            questions = json.load(file)
        return questions
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return []
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON.")
        return []

def get_random_question(questions):
    """Select a random question from the list."""
    if not questions:
        print("No questions available.")
        return None
    return random.choice(questions)

def main():
    # Path to the trivia questions JSON file
    file_path = "c:\\Users\\Union\\NBA Trivia Game\\NBAtriviaGame\\Data\\trivia_questions.json"
    
    # Load questions
    questions = load_questions(file_path)
    
    # Get a random question
    question = get_random_question(questions)
    
    if question:
        print("Here's your NBA trivia question:")
        print(f"Q: {question['question']}")
        print("Choices:")
        for idx, choice in enumerate(question['choices'], start=1):
            print(f"{idx}. {choice}")

if __name__ == "__main__":
    main()