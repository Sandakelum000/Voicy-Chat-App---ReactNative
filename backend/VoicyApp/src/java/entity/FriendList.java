/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author hiran
 */
@Entity
@Table(name = "friend_list")
public class FriendList implements Serializable{
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userId;

    
    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friendId;
    
    @Column(name = "display_name",length = 100,nullable = true)
    String displayName;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_status",length = 30)
    private Status status = Status.ACTIVE;

    public FriendList() {
    }

    public FriendList(User userId, User friendId) {
        this.userId = userId;
        this.friendId = friendId;
    }

    public FriendList(User userId, User friendId, String displayName) {
        
        this.userId = userId;
        this.friendId = friendId;
        this.displayName = displayName;
    }

    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the userId
     */
    public User getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(User userId) {
        this.userId = userId;
    }

    /**
     * @return the friendId
     */
    public User getFriendId() {
        return friendId;
    }

    /**
     * @param friendId the friendId to set
     */
    public void setFriendId(User friendId) {
        this.friendId = friendId;
    }

    /**
     * @return the status
     */
    public Status getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
