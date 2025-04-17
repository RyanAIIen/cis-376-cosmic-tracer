from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class Score(models.Model):
    """
    Stores a player's high score record.
    
    A score is associated with a user and includes their numeric score,
    the time played in seconds, and when the score was created.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='scores',
        help_text="The user who achieved this score"
    )
    score = models.IntegerField(
        validators=[MinValueValidator(0)],
        help_text="The player's score value (must be positive)"
    )
    time_played = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Time played in seconds"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="When this score was recorded"
    )
    
    class Meta:
        ordering = ['-score']
        verbose_name = 'Score'
        verbose_name_plural = 'Scores'
        indexes = [
            models.Index(fields=['-score']),
            models.Index(fields=['user']),
        ]
    
    def __str__(self):
        return f"{self.user.email}: {self.score} pts ({self.time_played}s)" 