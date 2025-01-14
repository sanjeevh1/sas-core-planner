class Course:
    """Stores the number, name, credits, and core codes of a course"""
    
    def __init__(self, number: int, name: str, credits: int, core_codes: list[str]):
        self.number = number
        self.name = name
        self.credits = credits
        self.core_codes = core_codes
    
    def __eq__(self, other):
        """
        Compares the two Courses by number
        """
        return self.number == other.number