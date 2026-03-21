import React from 'react';
import './CartaoDeInformacoesDoPerfil.css';
import { UserAvatar } from '../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { Stat } from './Stat';

interface Props {
    avatar: string;
    nickname: string;
    username: string;
    bio: string;
    website: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    onFollowersClick?: () => void;
    onFollowingClick?: () => void;
}

export const CartaoDeInformacoesDoPerfil: React.FC<Props> = ({ 
    avatar, 
    nickname, 
    username, 
    bio, 
    website,
    stats,
    onFollowersClick,
    onFollowingClick
}) => {
    return (
        <div className="profile-info-card">

            <div className="avatar-container">
                <UserAvatar size={"xl"} src={avatar} />
            </div>

            <div className="user-details">
                <p className="nickname">{nickname}</p>
                <p className="handle">{username}</p>
                <p className="bio">{bio}</p>
                <a href={website} target="_blank" rel="noopener noreferrer" className="website-link">{website}</a>
            </div>

            <div className="stats-container">
                <Stat value={stats.posts} label="Posts" />
                <Stat value={stats.followers} label="Seguidores" onClick={onFollowersClick} />
                <Stat value={stats.following} label="Seguindo" onClick={onFollowingClick} />
            </div>

            <div className="profile-actions">
                <button className="btn-edit">Editar Perfil</button>
                <button className="btn-share">Compartilhar</button>
            </div>

        </div>
    );
};