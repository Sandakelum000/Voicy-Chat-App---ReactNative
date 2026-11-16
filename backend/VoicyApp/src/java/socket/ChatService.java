package socket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entity.Chat;
import entity.FriendList;
import entity.Status;
import entity.User;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.Session;
import org.hibernate.Criteria;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

/**
 *
 * @author hiran
 */
public class ChatService {

    private static final ConcurrentHashMap<Integer, Session> SESSIONS = new ConcurrentHashMap<>();
    private static final Gson GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
    public static final String URL = "https://6c26f0ab6c97.ngrok-free.app";

    public static void register(int userId, Session session) {
        SESSIONS.put(userId, session);
    }

    public static void unregister(int userId) {
        SESSIONS.remove(userId);
    }

    public static void sendToUser(int userId, Object payload) {
        Session ws = SESSIONS.get(userId);
        if (ws != null && ws.isOpen()) {
            try {
                System.out.println(GSON.toJson(payload));
                ws.getBasicRemote().sendText(GSON.toJson(payload));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static List<ChatSummary> getFriendChatsForUser(int userId) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            Criteria c1 = session.createCriteria(FriendList.class);
            c1.add(Restrictions.eq("userId.id", userId));
            c1.add(Restrictions.eq("status", Status.ACTIVE));
            List<FriendList> friendList = c1.list();

            Map<Integer, ChatSummary> map = new LinkedHashMap<>();
            for (FriendList fl : friendList) {
                User myFriend = fl.getFriendId();
                
                Criteria c2 = session.createCriteria(Chat.class);
                Criterion rest1 = Restrictions.and(Restrictions.eq("from.id", userId), Restrictions.eq("to.id", myFriend.getId()));
                Criterion rest2 = Restrictions.and(Restrictions.eq("from.id", myFriend.getId()), Restrictions.eq("to.id", userId));

                Criterion rest3 = Restrictions.or(rest1, rest2);
                c2.add(rest3);
                c2.addOrder(Order.desc("updatedAt"));

                List<Chat> chats = c2.list();
                if (!chats.isEmpty()) {
                    int unread = 0;
                    for (Chat c : chats) {
                        if (c.getFrom().getId() == myFriend.getId()
                                && c.getTo().getId() == userId
                                && c.getStatus().equals(Status.DELIVERED)) {
                            unread += 1;
                        }
                    }
                    if (!map.containsKey(myFriend.getId())) {
                        String profileImage = ProfileService.getProfileUrl(myFriend.getId());
                        map.put(myFriend.getId(), new ChatSummary(myFriend.getId(),
                                myFriend.getFirstName() + " " + myFriend.getLastName(),
                                chats.get(0).getMessage(),
                                chats.get(0).getUpdatedAt(),
                                unread,
                                profileImage
                        ));
                    }
                }
            }
            return new ArrayList<>(map.values());
        } finally {
            session.close();
        }
    }


    public static void deliverChat(Chat chat) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = session.beginTransaction();
        session.persist(chat);
        tr.commit();
        session.close();

        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "chat");
        envelope.put("payload", chat);

        sendToUser(chat.getTo().getId(), envelope);
        sendToUser(chat.getFrom().getId(), envelope);

        sendToUser(chat.getTo().getId(), friendListEnvelope(getFriendChatsForUser(chat.getTo().getId())));
        sendToUser(chat.getFrom().getId(), friendListEnvelope(getFriendChatsForUser(chat.getFrom().getId())));
    }

    
    public static Map<String, Object> friendListEnvelope(List<ChatSummary> list) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "friend_list");
        envelope.put("payload", list);
        return envelope;
    }
    
    
    public static List<Chat> getChatHistory(int userId, int friendId) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = session.beginTransaction();
        try {
            Criteria c = session.createCriteria(Chat.class);
            c.add(Restrictions.or(
                    Restrictions.and(Restrictions.eq("from.id", userId), Restrictions.eq("to.id", friendId)),
                    Restrictions.and(Restrictions.eq("from.id", friendId), Restrictions.eq("to.id", userId))
            ));
            c.addOrder(Order.desc("createdAt"));
            List<Chat> chatList = c.list();
            for (Chat chat : chatList) {
                if (chat.getFrom().getId() == friendId
                        && chat.getTo().getId() == userId
                        && chat.getStatus() == Status.DELIVERED) {
                    chat.setStatus(Status.READ);
                    session.update(chat);
                }
            }
            tr.commit();
            return chatList;
        } finally {
            session.close();
        }
    }

    public static Map<String, Object> singleChatEnvelope(List<Chat> chats) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "single_chat");
        envelope.put("payload", chats);

        return envelope;
    }

    public static void saveNewChat(int userId, int friendId, String message,String file) {
        org.hibernate.Session s = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = s.beginTransaction();
        User me = (User) s.get(User.class, userId);
        User friend = (User) s.get(User.class, friendId);
        
        Criteria c1 = s.createCriteria(FriendList.class);
        c1.add(Restrictions.and(Restrictions.eq("userId", me),Restrictions.eq("friendId", friend)));
        FriendList fl1 = (FriendList) c1.uniqueResult();
        
        if (fl1 == null) {
            FriendList newFriend = new FriendList();
            newFriend.setFriendId(friend);
            newFriend.setUserId(me);
            newFriend.setStatus(Status.ACTIVE);
            s.save(newFriend);
        }
        
        Criteria c2 = s.createCriteria(FriendList.class);
        c2.add(Restrictions.and(Restrictions.eq("userId", friend),Restrictions.eq("friendId", me)));
        FriendList fl2 = (FriendList) c2.uniqueResult();
        
        if (fl2 == null) {
            FriendList newFriend = new FriendList();
            newFriend.setFriendId(me);
            newFriend.setUserId(friend);
            newFriend.setStatus(Status.ACTIVE);
            s.save(newFriend);
        }
        
        Chat chat = new Chat();
        chat.setFrom(me);
        chat.setTo(friend);
        chat.setMessage(message);
        chat.setCreatedAt(new Date());
        chat.setUpdatedAt(new Date());
        chat.setFiles(file);
        
        s.save(chat);
        tr.commit();
        s.close();
        
        Map<String,Object> envelope = new HashMap<>();
        envelope.put("type", "new_message");
        envelope.put("payload", chat);
        
        ChatService.sendToUser(chat.getFrom().getId(), envelope);
        ChatService.sendToUser(chat.getTo().getId(), envelope);
        
        List<ChatSummary> fromList = ChatService.getFriendChatsForUser(chat.getFrom().getId());
        List<ChatSummary> toList = ChatService.getFriendChatsForUser(chat.getTo().getId());
        
        Map<String, Object> fromMap = ChatService.friendListEnvelope(fromList);
        Map<String, Object> toMap = ChatService.friendListEnvelope(toList);
        
        ChatService.sendToUser(chat.getFrom().getId(), fromMap);
        ChatService.sendToUser(chat.getTo().getId(), toMap);
    }
}
