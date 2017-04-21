package com.medtrixhealthcare.MSCM2016;

import java.util.Timer;
import java.util.TimerTask;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.PowerManager;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;
import com.google.android.gcm.GCMBaseIntentService;
import com.medtrixhealthcare.MSCM2016.R;

public class GCMIntentService extends GCMBaseIntentService {
	
	public static final String SENDER_ID = "780495709018";
	
	public GCMIntentService() {
		super(SENDER_ID);
	}
	
	@Override
	protected void onError(Context arg0, String arg1) {
		Log.e("Registration", "Got an error!");
		Log.e("Registration", arg0.toString() + arg1.toString());
	}
	
	@Override
	protected void onMessage(Context context, Intent arg1) {
		Log.i("Registration", "Got a message!");
		Log.i("Registration", context.toString() + " " + arg1.toString());
		String message = arg1.getStringExtra("message");
		// Note: this is where you would handle the message and do something in
		// your application
		
		NotificationManager notificationManager = (NotificationManager) context
				.getSystemService(Context.NOTIFICATION_SERVICE);
		
		String title = context.getString(R.string.app_name);
		
		Intent notificationIntent = new Intent(context, Application.class);
		notificationIntent.putExtra("message", message);
		notificationIntent.setAction("" + System.currentTimeMillis());
		notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
		
		PendingIntent intent = PendingIntent
				.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this).setSmallIcon(R.drawable.ic_launcher)
				.setContentTitle(title).setAutoCancel(true)
				.setStyle(new NotificationCompat.BigTextStyle().bigText(message)).setContentText(message)
				.setVibrate(new long[] { 100, 500, 100, 1200 });
		
		mBuilder.setContentIntent(intent);
		notificationManager.notify(0, mBuilder.build());
		
		try {
			
			// Wake up Android Device from Sleeping
			PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
			final PowerManager.WakeLock mWakelock = pm.newWakeLock(PowerManager.ACQUIRE_CAUSES_WAKEUP, "GCM_PUSH");
			mWakelock.acquire();
			
			// Timer before putting Android Device to sleep mode.
			Timer timer = new Timer();
			TimerTask task = new TimerTask() {
				public void run() {
					mWakelock.release();
				}
			};
			
			timer.schedule(task, 50000);
			
		}
		catch (Exception e) {
		}
		
		Intent i = new Intent(this, Application.class);
		i.setAction(Intent.ACTION_MAIN);
		i.addCategory(Intent.CATEGORY_LAUNCHER);
		i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		i.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
		i.putExtra("message", message);
		startActivity(i);
		
		Intent broadcastintent = new Intent("MESSAGE_RECEIVED");
		// You can also include some extra data.
		broadcastintent.putExtras(arg1.getExtras());
		// broadcastintent.putExtra("message", arg1.putExtras(extras));
		LocalBroadcastManager.getInstance(this).sendBroadcast(broadcastintent);
	}
	
	@Override
	protected void onRegistered(Context arg0, String arg1) {
		Log.i("Registration", "Just registered!");
		Log.i("Registration", arg0.toString() + arg1.toString());
		Application.registrationId = arg1;
		Intent intent = new Intent("DEVICE_TOKEN_RECEIVED");
		// You can also include some extra data.
		intent.putExtra("token", arg1);
		LocalBroadcastManager.getInstance(this).sendBroadcast(intent);
		// This is where you need to call your server to record the device token
		// and registration id.
	}
	
	@Override
	protected void onUnregistered(Context arg0, String arg1) {
	}
}