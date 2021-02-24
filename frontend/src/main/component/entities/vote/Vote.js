import { Col, Row } from 'reactstrap';
// import { FontAwesomeIcon } from '@fontawesome/react-fontawesome'
// import { FontAwesomeIcon } from '@fortawesome/free-solid-svg-icons'
import { faCaretDown, faCaretUp, faPray } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../../../App';
// import { useHistory } from 'react-router-dom';
// import { ToastError } from '../shared/Toast'
import { useEffect, useState } from 'react';
import { Button } from 'reactstrap'
import Axios from '../../../api/Axios';
import { ToastError } from '../shared/Toast';
const Vote = ({ totalVote, postId, hideVote }) => {
    const [stateTotalVote, setStateTotalVote] = useState(0);
    const [userAction, setUserAction] = useState(null);
    const [haveUserVotedThisTurn, setHaveUserVotedThisTurn] = useState(false);



    const { user } = useAuth();
    // (totalVote);

    // (user);

    const returnTotalVotes = (post_votes) => {
        if (post_votes && post_votes.length) {
            const total = post_votes.map(e => e.type).reduce((a, b) => a + b, 0)
            return total
        } else {
            return 0;
        }
    }

    // (postId, 'postId');
    // (user, 'user');

    const checkIfUserVotedThisPost = () => {
        const voteInstance = totalVote?.find(e => e.user_id === user?.id);
        if (!voteInstance) {
            return false;
        }
        return voteInstance.type === 1 ? "UPVOTE" : "DOWNVOTE"

    }

    const callVoteAPI = async (voteType) => {
        const type = voteType === "UPVOTE" ? 1 : -1;
        const data = {
            post_id: postId,
            user_id: user.id,
            type: type,
        }
        Axios.post('vote/post', data);
    }

    const handleVoting = (voteType) => {
        if (!user || !user.id) {
            ToastError('Cần đăng nhập trước khi vote');
            return;
        }
        setUserAction(voteType)
        callVoteAPI(voteType);

        setHaveUserVotedThisTurn(true);


        if (!checkIfUserVotedThisPost()) {
            if (haveUserVotedThisTurn) {
                setStateTotalVote(voteType === "UPVOTE" ? stateTotalVote + 2 : stateTotalVote - 2);
            } else {
                setStateTotalVote(voteType === "UPVOTE" ? stateTotalVote + 1 : stateTotalVote - 1);
            }
        } else if (checkIfUserVotedThisPost() === "UPVOTE") {
            setStateTotalVote(voteType === "UPVOTE" ? stateTotalVote + 2 : stateTotalVote - 2);
        } else if (checkIfUserVotedThisPost() === "DOWNVOTE") {
            setStateTotalVote(voteType === "UPVOTE" ? stateTotalVote + 2 : stateTotalVote - 2);
        }

    }

    useEffect(() => {
        const output = returnTotalVotes(totalVote);
        setStateTotalVote(output)
    }, [totalVote])

    useEffect(() => {
        if (user && totalVote && postId) {
            if (!checkIfUserVotedThisPost()) {
                return;
            }
            setUserAction(checkIfUserVotedThisPost());
        }
    }, [user, totalVote, postId])




    return (
        <Row className="text-center">
            <Col xs="12"  >
                <Button
                    className="p-0"
                    color="transparent"
                    disabled={userAction === "UPVOTE"}
                    onClick={() => handleVoting('UPVOTE')}
                // className={hideVote ? "d-none" : "" }
                >
                    <FontAwesomeIcon
                        color={userAction === "UPVOTE" ? 'orange' : ''}
                        icon={faCaretUp}
                        size="lg" />
                </Button>

            </Col>
            <Col xs="12">
                {stateTotalVote}
            </Col>
            <Col xs="12" >
                <Button
                    className="p-0"
                    color="transparent"
                    disabled={userAction === "DOWNVOTE"}
                    onClick={() => handleVoting('DOWNVOTE')}>
                    <FontAwesomeIcon
                        color={userAction === "DOWNVOTE" ? 'orange' : ''}
                        icon={faCaretDown}
                        size="lg" />
                </Button>
            </Col>
        </Row>
    )
}
export default Vote;