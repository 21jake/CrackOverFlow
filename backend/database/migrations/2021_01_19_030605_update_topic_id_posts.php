<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateTopicIdPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        // Schema::table('posts', function (Blueprint $table) {
        //     $table->dropForeign('posts_topic_id_foreign');
        // });

        // Schema::table('posts', function (Blueprint $table) {
        //     $table->bigInteger('topic_id')->unsigned()->index();
        //     $table->foreign('topic_id')->references('id')->on('topics');
        // });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
