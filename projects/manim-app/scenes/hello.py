from manim import *


class HelloScene(Scene):
    def construct(self):
        circle = Circle(color=BLUE)
        label = Text("Hello, Manim")
        self.play(Create(circle))
        self.play(Write(label))
        self.wait(1)
