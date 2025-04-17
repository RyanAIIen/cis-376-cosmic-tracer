from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Score
from .serializers import ScoreSerializer
import logging

# Set up logger
logger = logging.getLogger(__name__)

class SubmitScoreView(APIView):
    """
    API endpoint to submit a new high score.
    POST /api/scores/submit/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Process high score submission"""
        user_email = request.user.email
        
        # Log the request
        logger.info(f"High score submission from {user_email}")
        
        # Validate score data
        score = request.data.get('score')
        if not score:
            logger.warning(f"Score submission missing score data: {request.data}")
            return Response({
                'success': False,
                'error': 'missing_score',
                'message': 'Score is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get time_played or default to 0
        time_played = request.data.get('time_played', 0)
        
        try:
            # Convert score to integer
            score_value = int(score)
            
            # Check if user already has a higher score
            existing_high_score = Score.objects.filter(user=request.user).order_by('-score').first()
            
            if existing_high_score and existing_high_score.score >= score_value:
                logger.info(f"User {user_email} already has a higher score ({existing_high_score.score}), not saving new score ({score_value})")
                return Response({
                    'success': True,
                    'message': 'Existing high score retained',
                    'id': existing_high_score.id,
                    'score': existing_high_score.score
                }, status=status.HTTP_200_OK)
            
            # Create new high score record
            score_obj = Score.objects.create(
                user=request.user,
                score=score_value,
                time_played=time_played
            )
            logger.info(f"New high score created for {user_email}: {score_value}")
            
            return Response({
                'success': True,
                'message': 'High score saved successfully',
                'id': score_obj.id,
                'score': score_obj.score
            }, status=status.HTTP_201_CREATED)
        except ValueError:
            logger.warning(f"Invalid score value: {score}")
            return Response({
                'success': False,
                'error': 'invalid_score',
                'message': 'Score must be a valid number'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error processing score submission: {str(e)}")
            return Response({
                'success': False,
                'error': 'server_error',
                'message': 'Server error processing score'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class LeaderboardView(APIView):
    """
    API endpoint to retrieve the top scores.
    GET /api/scores/leaderboard/
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Get leaderboard data"""
        try:
            # Log the request
            client_ip = request.META.get('REMOTE_ADDR', 'unknown')
            logger.info(f"Leaderboard request from {client_ip}")
            
            # Get top 10 scores
            scores = Score.objects.all().order_by('-score')[:10]
            serializer = ScoreSerializer(scores, many=True)
            
            # Log success
            logger.info(f"Returning {len(scores)} scores for leaderboard")
            
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching leaderboard: {str(e)}")
            return Response({
                'success': False,
                'error': 'server_error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 